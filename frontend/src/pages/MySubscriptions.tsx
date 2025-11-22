export const MySubscriptions = () => {
  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#111827",
          marginBottom: "1rem",
        }}
      >
        My Subscriptions
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
        View all your active and expired subscriptions
      </p>

      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <p style={{ color: "#6b7280", textAlign: "center" }}>
          Loading your subscriptions...
        </p>
      </div>
    </div>
  );
};
