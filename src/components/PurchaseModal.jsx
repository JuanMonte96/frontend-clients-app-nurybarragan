import React, { useState } from "react";

export default function PurchaseModal({ isOpen, onClose, pkg, onConfirm }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!isOpen) return null; // si no está abierto, no renderiza nada

  return (
    <div className="fixed inset-0 bg-[#333333] bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#fff8e1] rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-bold mb-4 text-[#333333] text-center">
          Comprar {pkg.name_package}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onConfirm({ name, email });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-[#333333] text-sm font-medium mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#2c2c2c] text-[#fff8e1] border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffc107]"
            />
          </div>

          <div>
            <label className="block text-[#333333] text-sm font-medium mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#2c2c2c] text-[#fff8e1] border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffc107]"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#333333] text-[#ffc107] rounded-3xl font-bold hover:bg-gray-400"
            >
              CANCELAR
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#ffc107] text-[#333333] rounded-3xl hover:bg-[#ffb300] font-bold"
            >
              COMPRAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}