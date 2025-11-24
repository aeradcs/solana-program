import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { getProgram } from "../utils/anchorSetup";
import { lamportsToSol } from "../utils/constants";

interface PlanData {
  publicKey: PublicKey;
  account: {
    creator: PublicKey;
    planId: BN;
    name: string;
    price: BN;
    durationDays: number;
    createdAt: BN;
  };
}

interface SubscriptionData {
  account: {
    subscriber: PublicKey;
    creator: PublicKey;
    planId: BN;
    expiresAt: BN;
    createdAt: BN;
  };
}

interface TopPlanStats {
  plan: PlanData;
  subscriberCount: number;
  totalEarned: number;
}

export const TopPlans = () => {
  const [topPlans, setTopPlans] = useState<TopPlanStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTopPlans = async () => {
    try {
      setLoading(true);
      setError("");

      const { program } = getProgram();

      const allPlans = await program.account.creatorProfile.all();
      const allSubscriptions = await program.account.subscription.all();

      const planStatsMap = new Map<string, TopPlanStats>();

      for (const plan of allPlans as PlanData[]) {
        const key = `${plan.account.creator.toBase58()}-${plan.account.planId.toString()}`;
        planStatsMap.set(key, {
          plan,
          subscriberCount: 0,
          totalEarned: 0,
        });
      }

      for (const subscription of allSubscriptions as SubscriptionData[]) {
        const key = `${subscription.account.creator.toBase58()}-${subscription.account.planId.toString()}`;
        const stats = planStatsMap.get(key);
        if (stats) {
          stats.subscriberCount += 1;
        }
      }

      for (const stats of planStatsMap.values()) {
        const priceInSol = lamportsToSol(stats.plan.account.price.toNumber());
        stats.totalEarned = stats.subscriberCount * priceInSol;
      }

      const sortedPlans = Array.from(planStatsMap.values())
        .sort((a, b) => {
          if (b.subscriberCount !== a.subscriberCount) {
            return b.subscriberCount - a.subscriberCount;
          }
          return b.totalEarned - a.totalEarned;
        })
        .slice(0, 5);

      setTopPlans(sortedPlans);
    } catch (err) {
      setError("Failed to load top plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopPlans();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              width: "3rem",
              height: "3rem",
              border: "0.25rem solid #e5e7eb",
              borderTopColor: "#9333ea",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>
            Loading top plans...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#111827",
          marginBottom: "2rem",
        }}
      >
        Top 5 Plans
      </h1>

      {error && (
        <div
          style={{
            padding: "0.75rem",
            backgroundColor: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: "0.375rem",
            marginBottom: "1rem",
          }}
        >
          <p style={{ color: "#991b1b", fontSize: "0.875rem", margin: 0 }}>
            {error}
          </p>
        </div>
      )}

      {!error && topPlans.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <p style={{ color: "#6b7280" }}>No plans available yet.</p>
        </div>
      )}

      {!error && topPlans.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {topPlans.map((stats, index) => {
            const getRankStyle = (rank: number) => {
              if (rank === 0)
                return { backgroundColor: "#fbbf24", color: "#78350f" };
              if (rank === 1)
                return { backgroundColor: "#fb923c", color: "#7c2d12" };
              if (rank === 2)
                return { backgroundColor: "#f97316", color: "#7c2d12" };
              if (rank === 3)
                return { backgroundColor: "#f87171", color: "#7f1d1d" };
              return { backgroundColor: "#ef4444", color: "#7f1d1d" };
            };

            const getRankLabel = (rank: number) => {
              if (rank === 0) return "1st";
              if (rank === 1) return "2nd";
              if (rank === 2) return "3rd";
              if (rank === 3) return "4th";
              return "5th";
            };

            return (
              <div
                key={`${stats.plan.account.creator.toBase58()}-${stats.plan.account.planId.toString()}`}
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  transition: "box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "3rem",
                      height: "2.5rem",
                      borderRadius: "0.375rem",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      ...getRankStyle(index),
                    }}
                  >
                    {getRankLabel(index)}
                  </span>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    {stats.plan.account.name}
                  </h3>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1.5rem",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        marginBottom: "0.25rem",
                        margin: 0,
                      }}
                    >
                      Subscribers
                    </p>
                    <p
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "#111827",
                        margin: 0,
                      }}
                    >
                      {stats.subscriberCount}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        marginBottom: "0.25rem",
                        margin: 0,
                      }}
                    >
                      Price
                    </p>
                    <p
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "#9333ea",
                        margin: 0,
                      }}
                    >
                      {lamportsToSol(stats.plan.account.price.toNumber())} SOL
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        marginBottom: "0.25rem",
                        margin: 0,
                      }}
                    >
                      Total Earned
                    </p>
                    <p
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "#059669",
                        margin: 0,
                      }}
                    >
                      {stats.totalEarned.toFixed(2)} SOL
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
