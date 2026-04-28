"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useWriteContract } from "wagmi";
import { usePublicClient } from "wagmi";

import { useAuth } from "@/context/AuthContext";
import { realApi as api } from "@/lib/api";
import { escrowAbi } from "@/lib/escrowAbi";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Copy,
  Gavel,
  Loader2,
  XCircle,
} from "lucide-react";

type Dispute = {
  id: number;
  escrow_id: number;
  status: string;
  opened_at: string;
  contract_address: string;
  buyer_address: string;
  seller_address: string;
  total_amount: string;
  vote_count: number;
};

function shortenAddress(addr: string) {
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

function formatRemaining(ms: number) {
  if (ms <= 0) return "Expired";
  const totalSec = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  return `${hrs}h ${mins}m`;
}

export default function DisputesPage() {
  const { user } = useAuth();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState<Dispute[]>([]);
  const [actionError, setActionError] = useState<Record<number, string>>({});
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>(
    {},
  );

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      if (!address) return;
      setLoading(true);
      setError("");
      try {
        const res = await api.listDisputes(address);
        setItems(res.disputes);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load disputes.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, address]);

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  const doVote = async (d: Dispute) => {
    if (!address) return;
    if (!publicClient) return;
    setActionLoading((s) => ({ ...s, [d.id]: true }));
    setActionError((s) => ({ ...s, [d.id]: "" }));
    try {
      const hash = await writeContractAsync({
        address: d.contract_address as `0x${string}`,
        abi: escrowAbi,
        functionName: "voteDispute",
      });
      await publicClient.waitForTransactionReceipt({ hash });
      await api.voteDispute(d.id, address, hash);
      const refreshed = await api.listDisputes(address);
      setItems(refreshed.disputes);
    } catch (e: unknown) {
      setActionError((s) => ({
        ...s,
        [d.id]: e instanceof Error ? e.message : "Vote failed.",
      }));
    } finally {
      setActionLoading((s) => ({ ...s, [d.id]: false }));
    }
  };

  const doRefund = async (d: Dispute) => {
    if (!address) return;
    if (!publicClient) return;
    setActionLoading((s) => ({ ...s, [d.id]: true }));
    setActionError((s) => ({ ...s, [d.id]: "" }));
    try {
      const hash = await writeContractAsync({
        address: d.contract_address as `0x${string}`,
        abi: escrowAbi,
        functionName: "refundAfterTimeout",
      });
      await publicClient.waitForTransactionReceipt({ hash });
      await api.refundDisputeAfterTimeout(d.id, hash);
      const refreshed = await api.listDisputes(address);
      setItems(refreshed.disputes);
    } catch (e: unknown) {
      setActionError((s) => ({
        ...s,
        [d.id]: e instanceof Error ? e.message : "Refund trigger failed.",
      }));
    } finally {
      setActionLoading((s) => ({ ...s, [d.id]: false }));
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-6 py-24 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Community Arbitration
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Disputes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Vote on open disputes. When 2 votes are cast, funds are released to the seller. If 2 days pass,
            anyone can trigger a refund back to the buyer.
          </p>
        </div>
        <Link href={user.role === "client" ? "/client/dashboard" : "/freelancer/dashboard"}>
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex items-center gap-3">
          <XCircle className="w-5 h-5 shrink-0" /> {error}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <div className="font-semibold text-gray-900">No open disputes</div>
          <div className="text-sm text-gray-500">When a seller opens a dispute, it will appear here for voting.</div>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((d) => {
            const openedMs = new Date(d.opened_at).getTime();
            const expiresAt = openedMs + 2 * 24 * 60 * 60 * 1000;
            const remaining = expiresAt - Date.now();
            const expired = remaining <= 0;
            const isLoading = actionLoading[d.id] === true;
            const e = actionError[d.id];
            return (
              <div
                key={d.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      <Gavel className="w-4 h-4" /> Dispute #{d.id}
                    </div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center justify-between md:justify-start md:gap-2">
                        <span className="text-gray-500">Escrow</span>
                        <span className="font-semibold text-gray-900">#{d.escrow_id}</span>
                      </div>
                      <div className="flex items-center justify-between md:justify-start md:gap-2">
                        <span className="text-gray-500">Votes</span>
                        <span className="font-semibold text-gray-900">
                          {d.vote_count}/2
                        </span>
                      </div>
                      <div className="flex items-center justify-between md:justify-start md:gap-2">
                        <span className="text-gray-500">Contract</span>
                        <span className="font-mono text-gray-800 truncate">
                          {shortenAddress(d.contract_address)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(d.contract_address)}
                          className="text-gray-400 hover:text-emerald-600 transition-colors"
                          title="Copy"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between md:justify-start md:gap-2">
                        <span className="text-gray-500">Time left</span>
                        <span
                          className={`font-semibold ${expired ? "text-red-600" : "text-gray-900"}`}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {formatRemaining(remaining)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                    <Button
                      className="gap-2"
                      isLoading={isLoading}
                      onClick={() => doVote(d)}
                      disabled={d.vote_count >= 2}
                    >
                      Vote
                    </Button>
                    <Button
                      variant="secondary"
                      isLoading={isLoading}
                      onClick={() => doRefund(d)}
                      disabled={!expired}
                    >
                      Trigger refund (after 2 days)
                    </Button>
                  </div>
                </div>

                {e && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <XCircle className="w-4 h-4 shrink-0" /> {e}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

