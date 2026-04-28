"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useWriteContract } from "wagmi";
import { usePublicClient } from "wagmi";

import { realApi as api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { escrowAbi } from "@/lib/escrowAbi";
import { ArrowLeft, Copy, Loader2, XCircle, AlertTriangle } from "lucide-react";

type Milestone = {
  id: number;
  milestone_index: number;
  amount: string;
  funded: boolean;
  approved: boolean;
  released: boolean;
};

type EscrowDetails = {
  id: number;
  contract_address: string;
  buyer_address: string;
  seller_address: string;
  total_amount: string;
  status: string;
  milestones: Milestone[];
};

function shortenAddress(addr: string) {
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

export default function FreelancerEscrowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: jobId } = use(params);
  const { user } = useAuth();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const [escrow, setEscrow] = useState<EscrowDetails | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [disputeError, setDisputeError] = useState("");
  const [openingDispute, setOpeningDispute] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      setError("");
      try {
        const rawJobRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`,
        );
        const rawJob = await rawJobRes.json();

        if (!rawJob?.id) {
          setError("Job not found.");
          return;
        }

        setJobTitle(rawJob.title ?? "");
        const escrowId = rawJob.escrow_id;
        if (!escrowId) {
          setError("No escrow contract linked to this job yet.");
          return;
        }

        const details = await api.getEscrowDetails(escrowId);
        setEscrow(details);
      } catch {
        setError("Failed to load escrow details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jobId, user]);

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  const handleOpenDispute = async () => {
    if (!escrow) return;
    if (!address) {
      setDisputeError("Connect your wallet first.");
      return;
    }
    if (!publicClient) return;
    setOpeningDispute(true);
    setDisputeError("");
    try {
      const hash = await writeContractAsync({
        address: escrow.contract_address as `0x${string}`,
        abi: escrowAbi,
        functionName: "openDispute",
      });
      await publicClient.waitForTransactionReceipt({ hash });
      await api.openDispute(escrow.id, address, hash);
    } catch (e: unknown) {
      setDisputeError(e instanceof Error ? e.message : "Failed to open dispute.");
    } finally {
      setOpeningDispute(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-10 max-w-3xl">
        <Link
          href="/freelancer/dashboard"
          className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex items-center gap-3">
          <XCircle className="w-5 h-5 shrink-0" /> {error}
        </div>
      </div>
    );
  }

  if (!escrow) return null;

  return (
    <div className="container mx-auto px-6 py-10 max-w-3xl">
      <Link
        href="/freelancer/dashboard"
        className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-6 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>

      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Escrow Contract
        </span>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{jobTitle}</h1>
        <p className="text-sm text-gray-500">
          As the seller, you can open a dispute once at least one milestone is funded.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wider">
          Contract Details
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Contract Address</span>
            <div className="flex items-center gap-2 font-mono text-gray-800">
              <span>{shortenAddress(escrow.contract_address)}</span>
              <button
                onClick={() => copyToClipboard(escrow.contract_address)}
                className="text-gray-400 hover:text-emerald-600 transition-colors"
                title="Copy"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Buyer</span>
            <span className="font-mono text-gray-800">
              {shortenAddress(escrow.buyer_address)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Seller</span>
            <span className="font-mono text-gray-800">
              {shortenAddress(escrow.seller_address)}
            </span>
          </div>
        </div>
      </div>

      {disputeError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {disputeError}
        </div>
      )}

      <Button
        size="lg"
        className="gap-2"
        isLoading={openingDispute}
        onClick={handleOpenDispute}
      >
        Mark Contract as Dispute
      </Button>
    </div>
  );
}

