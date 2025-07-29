import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/api";

const CustomizeQuote = () => {
  const { requestId } = useParams();
  const [quoteItems, setQuoteItems] = useState([]);
  const [quoteDetails, setQuoteDetails] = useState({
    date: "",
    refNo: "",
    to: "",
    designation: "",
    company: "",
    address: "",
    subject: "",
    senderName: "",
  });

    console.log("requestId from URL:", requestId);
  console.log("Decoded requestId:", decodeURIComponent(requestId));

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await axios.get(`/quote/by-request/${encodeURIComponent(requestId)}`);
         if (!Array.isArray(res.data) || res.data.length === 0) {
      console.warn("No vendor quotes found for this request.");
      return;
    }
          const vendorQuote = res.data[0];
          setQuoteItems(
            vendorQuote.items.map((item) => ({
              description: item.description || "",
              uom: item.uom || "",
              qty: item.quantity || 0,
              rate: item.rate || 0,
              amount: item.amount || 0,
              gstPercentage: item.gst || 0,
              gstAmount: item.gstAmount || 0,
              netAmount: item.netAmount || 0,
            }))
          );
        
      } catch (err) {
        console.error(err);
      }
    };

    fetchQuote();
  }, [requestId]);

  const handleChange = (index, field, value) => {
    const updatedItems = [...quoteItems];
    updatedItems[index][field] = value;
    setQuoteItems(updatedItems);
  };

  const handleDetailsChange = (field, value) => {
    setQuoteDetails({ ...quoteDetails, [field]: value });
  };

  const calculateTotals = () => {
    let total = 0,
      gst = 0,
      net = 0;
    quoteItems.forEach((item) => {
      total += parseFloat(item.amount || 0);
      gst += parseFloat(item.gstAmount || 0);
      net += parseFloat(item.netAmount || 0);
    });
    return { total, gst, net };
  };

  const { total, gst, net } = calculateTotals();

  const printQuote = () => {
    window.print();
  };

  const handleSave = async () => {
    try {
      const payload = {
        requestId,
        quoteItems,
        quoteDetails,
      };

      await axios.put(`/quote/by-request/${requestId}`, payload);

      alert("Quotation saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save quotation. See console for details.");
    }
  };


  return (
    <div className="p-10 bg-white text-black font-sans max-w-6xl mx-auto shadow-lg border border-gray-300">
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold">एनटीपीसी कर्मचारी सहकारी उपभोक्ता भण्डार (मर्या.)</h1>
        <p className="text-sm">एल.एन. 2, शॉपिंग सेंटर, एन.टी.पी.सी. विंध्यनगर, पो. - विंध्यनगर, जिला - सिंगरौली (म. प्र.)</p>
        <input
          type="date"
          value={quoteDetails.date}
          onChange={(e) => handleDetailsChange("date", e.target.value)}
          className="text-sm mt-1 border rounded p-1"
        />
      </div>

      <div className="text-sm mb-4 space-y-1">
        <input
          type="text"
          placeholder="Ref. #"
          value={quoteDetails.refNo}
          onChange={(e) => handleDetailsChange("refNo", e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
        <textarea
          rows="3"
          placeholder="To: Name\nDesignation\nCompany\nAddress"
          value={quoteDetails.to}
          onChange={(e) => handleDetailsChange("to", e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Subject"
          value={quoteDetails.subject}
          onChange={(e) => handleDetailsChange("subject", e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
        <p className="mt-2">Dear Sir,</p>
        <p>With the reference of the reference cited above, please find the quotation as below:</p>
      </div>

      <table className="w-full border-collapse border border-gray-400 text-sm mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Sr</th>
            <th className="border px-2 py-1">Item Description</th>
            <th className="border px-2 py-1">UOM</th>
            <th className="border px-2 py-1">Qty</th>
            <th className="border px-2 py-1">Rate</th>
            <th className="border px-2 py-1">Amount</th>
            <th className="border px-2 py-1">GST(%)</th>
            <th className="border px-2 py-1">GST</th>
            <th className="border px-2 py-1">Net Amount</th>
          </tr>
        </thead>
        <tbody>
          {quoteItems.map((item, index) => (
            <tr key={index}>
              <td className="border px-2 py-1 text-center">{index + 1}</td>
              <td className="border px-2 py-1">
                <textarea
                  rows="3"
                  className="w-full border rounded"
                  value={item.description}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                />
              </td>
              <td className="border px-2 py-1 text-center">
                <input
                  type="text"
                  className="w-full border"
                  value={item.uom}
                  onChange={(e) => handleChange(index, "uom", e.target.value)}
                />
              </td>
              <td className="border px-2 py-1 text-center">{item.qty}</td>
              <td className="border px-2 py-1 text-right">
                <input
                  type="number"
                  className="w-full border"
                  value={item.rate}
                  onChange={(e) => {
                    const rate = parseFloat(e.target.value) || 0;
                    const amount = rate * (item.qty || 0);
                    const gstAmount = (amount * (item.gstPercentage || 0)) / 100;
                    const net = amount + gst;
                    handleChange(index, "rate", rate);
                    handleChange(index, "amount", amount.toFixed(2));
                    handleChange(index, "gstAmount", gstAmount.toFixed(2));
                    handleChange(index, "netAmount", net.toFixed(2));
                  }}
                />
              </td>
              <td className="border px-2 py-1 text-right">{item.amount}</td>
              <td className="border px-2 py-1 text-center">
                <input
                  type="number"
                  className="w-full border"
                  value={item.gstPercentage}
                  onChange={(e) => {
                    const gstPercentage = parseFloat(e.target.value) || 0;
                    const gstAmount = ((item.amount || 0) * gstPercentage) / 100;
                    const net = (parseFloat(item.amount || 0) + gstAmount).toFixed(2);
                    handleChange(index, "gstPercentage", gstPercentage);
                    handleChange(index, "gstAmount", gstAmount.toFixed(2));
                    handleChange(index, "netAmount", net);
                  }}
                />
              </td>
              <td className="border px-2 py-1 text-right">{item.gstAmount}</td>
              <td className="border px-2 py-1 text-right">{item.netAmount}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-semibold bg-gray-100">
            <td className="border px-2 py-1 text-right" colSpan={5}>Total =</td>
            <td className="border px-2 py-1 text-right">{total.toFixed(2)}</td>
            <td className="border px-2 py-1"></td>
            <td className="border px-2 py-1 text-right">{gst.toFixed(2)}</td>
            <td className="border px-2 py-1 text-right">{net.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <div className="text-sm mb-6">
        <strong>Note:</strong>
        <ol className="list-decimal ml-5">
          <li>GST: As above</li>
          <li>Delivery: within 2 weeks after confirmation of the order</li>
          <li>Payment: 100% within 30 days after the delivery</li>
        </ol>
      </div>

      <div className="text-sm">
        <p>Regards,</p>
        <input
          type="text"
          placeholder="Sender Name"
          value={quoteDetails.senderName}
          onChange={(e) => handleDetailsChange("senderName", e.target.value)}
          className="mt-2 border rounded px-2 py-1"
        />
        <p className="text-xs">(For and on behalf of NTPC KSUB (Maryadit), Vindhyanagar.)</p>
      </div>

      <button onClick={printQuote} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Print</button>
      <button
  onClick={handleSave}
  className="mt-4 ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
>
  Save Quotation
</button>

    </div>
    
  );

  
};


export default CustomizeQuote;
