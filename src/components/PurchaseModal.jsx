import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function PurchaseModal({ isOpen, onClose, pkg, onConfirm }) {

  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");

  if (!isOpen) return null; // si no está abierto, no renderiza nada

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="modal-content bg-[#fff8e1] rounded-lg sm:rounded-xl shadow-lg w-full max-w-md p-4 sm:p-6 relative">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[var(--color-text)] text-center">
          {t("purchase.title")} {pkg.name_package}
        </h2>
        <h3 className="text-center text-base sm:text-lg font-semibold text-[var(--color-text)] mb-2">
          {t("purchase.description")}: {pkg.description_package}
        </h3>
        <h3 className="mb-3 sm:mb-4 text-center text-lg sm:text-xl font-semibold text-[var(--color-text )]">
          {t("purchase.price")}: <span className="text-[var(--color-primary)]">€{pkg.price_package}</span>
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onConfirm({ name, email, telephone });
          }}
          className="space-y-3 sm:space-y-4"
        >
          <div>
            <label className="block text-[#333333] text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              {t("purchase.name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#2c2c2c] text-[#fff8e1] border border-gray-300 rounded-lg p-2 sm:p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ffc107]"
            />
          </div>

          <div>
            <label className="block text-[#333333] text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              {t("purchase.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#2c2c2c] text-[#fff8e1] border border-gray-300 rounded-lg p-2 sm:p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ffc107]"
            />
          </div>
          <div>
            <label className="block text-[#333333] text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              {t("purchase.phone")}
            </label>
            <input
              type="number"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
              className="w-full bg-[#2c2c2c] text-[#fff8e1] border border-gray-300 rounded-lg p-2 sm:p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ffc107]"
            />
          </div>


          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between mt-4 sm:mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-2 bg-[#333333] text-[#ffc107] rounded-2xl sm:rounded-3xl font-bold hover:bg-gray-400 text-xs sm:text-sm order-2 sm:order-1"
            >
              {t("purchase.cancel")}
            </button>

            <button
              type="submit"
              className="px-3 sm:px-4 py-2 bg-[#ffc107] text-[#333333] rounded-2xl sm:rounded-3xl hover:bg-[#ffb300] font-bold text-xs sm:text-sm order-1 sm:order-2"
            >
              {t("purchase.buy")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}