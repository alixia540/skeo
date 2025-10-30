// @ts-nocheck
"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function PayPalButton({ amount }: { amount: string }) {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  const isDark = theme === "dark";

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AdYF4FyjBUKIR0JZ4buk5NLnICKEI726JnNOr9eHXFAClWbEhe5AKtVnllynoWA2Ib5Jkm6eD5aMEpko", // ✅ ton client ID sandbox
        currency: "EUR",
      }}
    >
      <div
        className="flex justify-center mt-4 w-full"
        style={{
          background: "none", // ✅ supprime tout fond autour
          borderRadius: "12px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PayPalButtons
          style={{
            layout: "vertical",
            color: isDark ? "silver" : "blue", // ✅ couleurs PayPal originales
            shape: "pill",
            label: "pay",
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount,
                  },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            if (!actions.order) return;
            return actions.order.capture().then((details) => {
              alert(`✅ Merci ${details.payer.name?.given_name} pour ton achat !`);
            });
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}
