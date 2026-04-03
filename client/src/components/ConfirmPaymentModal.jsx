import { useState } from "react";
import axios from "axios";
import { serverUrl } from "../utils/serverUrl.js";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

const ConfirmPaymentModal = ({ plan, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleConfirm = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `${serverUrl}/api/payment/pay`,
        {
          credits: plan.credits,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      setLoading(false);

      if (data.success) {
        // Refresh user data with updated credits
        const token = localStorage.getItem("token");
        const userResult = await axios.get(serverUrl + "/api/user/current-user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        dispatch(setUserData(userResult.data));
        onSuccess(data);
      } else {
        alert("Payment Failed ❌");
      }

      onClose();

    } catch (error) {
      setLoading(false);
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-87.5 text-center shadow-xl">
        
        <h2 className="text-xl font-semibold mb-2">
          Confirm Payment
        </h2>

        <p className="text-gray-600 text-sm mb-4">
          You are about to purchase <b>{plan.name}</b>
        </p>

        <div className="bg-gray-50 p-4 rounded-xl mb-4">
          <p className="text-lg font-bold text-emerald-600">
            {plan.price}
          </p>
          <p className="text-sm text-gray-500">
            {plan.credits} Credits
          </p>
        </div>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          {loading ? "Processing..." : "Confirm Payment"}
        </button>

        <button
          onClick={onClose}
          className="mt-3 text-sm text-gray-500"
        >
          Cancel
        </button>

      </div>
    </div>
  );
};

export default ConfirmPaymentModal;