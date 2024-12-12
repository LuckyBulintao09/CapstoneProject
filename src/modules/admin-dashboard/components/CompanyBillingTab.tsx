"use client";
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; 
import { toast } from 'sonner';


const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-3/4 md:w-1/2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Select Company</h2>
          <button onClick={onClose} className="text-lg font-semibold text-red-500">X</button>
        </div>
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

function CompanyBillingTab() {
  const [billingData, setBillingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage] = useState(5); 
  const [selectedCompany, setSelectedCompany] = useState(""); 
  const [previewData, setPreviewData] = useState([]); 
  const [totalAmountToBeCollected, setTotalAmountToBeCollected] = useState(0); 

  useEffect(() => {
    const fetchCompanyBilling = async () => {
      const { data, error } = await supabase
        .from('company_billing')
        .select(`id, created_at, company_name, amount, isOfficial, isSettled, paidAt, owner_id, amountToBeCollected, owner_email, property_title, service,tenant,unit`)
        .neq('service', 'On-Site Visit')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setBillingData(data || []);
        setFilteredData(data || []);
      }
    };

    fetchCompanyBilling();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = billingData.filter((item) => {
      return (
        item.id.toString().toLowerCase().includes(value) ||
        new Date(item.created_at).toLocaleDateString().toLowerCase().includes(value) ||
        item.company_name.toLowerCase().includes(value) ||
        item.service.toLowerCase().includes(value) ||
        item.property_title.toLowerCase().includes(value) ||
        (item.isSettled ? "settled" : "unsettled").toLowerCase().includes(value) ||
        (item.isOfficial ? "yes" : "no").toLowerCase().includes(value)
      );
    });

    setFilteredData(filtered);
    setCurrentPage(1); 
  };

  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleGeneratePDF = (companyName) => {
    const companyData = filteredData.filter(item => item.company_name === companyName && !item.isSettled);
    const officialData = companyData.filter(item => item.isOfficial);
    const totalAmount = officialData.reduce((sum, item) => sum + item.amountToBeCollected, 0);
  
    const doc = new jsPDF();
  
    const logoUrl = "https://kxkkueirrfwmrrurarhw.supabase.co/storage/v1/object/public/unihomes%20image%20storage/logo/Logo.png";
    const logoWidth = 20; 
    const logoHeight = 20;
  
    doc.addImage(logoUrl, 'PNG', 20, 10, logoWidth, logoHeight);
  
    doc.setFontSize(12); 
    doc.setFont("helvetica", "bold");
    doc.text("Unihomes", 60, 20); 
  
    doc.setFontSize(10); 
    doc.text(`Invoice Report for ${companyName}`, 20, 35);
  
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(8); 
    doc.text(`Date Generated: ${currentDate}`, 20, 42);
  
    const headers = ["Transaction ID", "Client Name", "Unit", "Date", "Amount", "Property", "Status", "Official", "Amount to be Collected"];
    const rows = companyData.map(item => [
      item.id,
      item.tenant,
      item.unit,
      new Date(item.created_at).toLocaleDateString(),
      `PHP ${item.amount.toFixed(2)}`,
      item.property_title,
      item.isSettled ? "Settled" : "Unsettled",
      item.isOfficial ? "Yes" : "No",
      `PHP ${item.amountToBeCollected.toFixed(2)}`
    ]);
  
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 50,
      theme: 'striped',
      styles: { fontSize: 8, cellPadding: 1, halign: 'center' }, 
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
    });
  
    doc.setFontSize(10); 
    doc.text(`Total Amount to be Collected (Official): $${totalAmount.toFixed(2)}`, 20, doc.lastAutoTable.finalY + 5);
  
    doc.save(`invoice_report_${companyName}.pdf`);
    setOpenModal(false);
  };
  
  
  

  const handleCompanySelect = (companyName) => {
    setSelectedCompany(companyName);
    const previewData = filteredData.filter(item => item.company_name === companyName && !item.isSettled);
    setPreviewData(previewData);
  
    const officialData = previewData.filter(item => item.isOfficial);
    const totalAmount = officialData.reduce((sum, item) => sum + item.amountToBeCollected, 0);
    setTotalAmountToBeCollected(totalAmount);
  };
  

  const handleMarkAsPaid = async (invoiceId) => {
    const { data, error } = await supabase
      .from('company_billing')
      .update({
        isSettled: true,
        paidAt: new Date().toISOString(),
      })
      .eq('id', invoiceId);

    if (error) {
      console.error('Error marking invoice as paid:', error);
    } else {
      setBillingData((prevData) =>
        prevData.map((item) =>
          item.id === invoiceId ? { ...item, isSettled: true, paidAt: new Date().toISOString() } : item
        )
      );
      setFilteredData((prevData) =>
        prevData.map((item) =>
          item.id === invoiceId ? { ...item, isSettled: true, paidAt: new Date().toISOString() } : item
        )
      );
    }
    toast.success('Invoice marked as paid');
  };

  const handleUndoMarkAsPaid = async (invoiceId) => {
    const { data, error } = await supabase
      .from('company_billing')
      .update({
        isSettled: false,
        paidAt: null,
      })
      .eq('id', invoiceId);

    if (error) {
      console.error('Error undoing mark as paid:', error);
    } else {
      setBillingData((prevData) =>
        prevData.map((item) =>
          item.id === invoiceId ? { ...item, isSettled: false, paidAt: null } : item
        )
      );
      setFilteredData((prevData) =>
        prevData.map((item) =>
          item.id === invoiceId ? { ...item, isSettled: false, paidAt: null } : item
        )
      );
    }
    toast.warning('Invoice marked as unsettled');
  };

  return (
    <>
      <Card className="h-full bg-white dark:bg-secondary">
        <CardHeader>
          <CardTitle>Company Billing</CardTitle>
        </CardHeader>
        <CardContent>
        <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search by Date, Company Name, Service, Property, Status, or Official"
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-1 p-2 border rounded" 
        />
        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded sm:w-auto" 
        >
          Create Invoice
        </button>
      </div>

          

          <div className="overflow-x-auto">
            <Table className="w-full min-w-[800px]">
              <TableHeader className="bg-blue-800">
                <TableRow>
                  <TableHead className="text-white">Invoice ID</TableHead>
                  <TableHead className="text-white">Client Name</TableHead>
                  <TableHead className="text-white">Unit</TableHead>
                  <TableHead className="text-white">Date</TableHead>
                  <TableHead className="text-white">Company Name</TableHead>
                  <TableHead className="text-white">Service</TableHead>
                  <TableHead className="text-white">Property</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Official</TableHead>
                  <TableHead className="text-white">Paid Date</TableHead>
                  <TableHead className="text-right text-white">Amount</TableHead>
                  <TableHead className="text-right text-white">Amount to be Collected</TableHead>
                  <TableHead className="text-center text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.tenant}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{item.company_name}</TableCell>
                      <TableCell>{item.service}</TableCell>
                      <TableCell>{item.property_title}</TableCell>
                      <TableCell>
                        <span style={{ color: item.isSettled ? 'green' : 'orange' }}>
                          {item.isSettled ? 'Paid' : 'Unpaid'}
                        </span>
                      </TableCell>
                      <TableCell>{item.isOfficial ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        {item.paidAt ? new Date(item.paidAt).toLocaleDateString() : "Not Paid"}
                      </TableCell>
                      <TableCell className="text-right truncate">₱{" "}{new Intl.NumberFormat("en-PH", {
                                        style: "decimal",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                      }).format(item.amount.toFixed(2))}</TableCell>
                      
                      <TableCell className="text-right truncate">₱{" "}{new Intl.NumberFormat("en-PH", {
                                        style: "decimal",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                      }).format(item.amountToBeCollected.toFixed(2))}</TableCell>
                      
                      <TableCell className="text-center">
                        {item.isOfficial && !item.isSettled && (
                          <button
                            onClick={() => handleMarkAsPaid(item.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded"
                          >
                            Mark as Paid
                          </button>
                        )}
                        {item.isSettled && (
                          <button
                            onClick={() => handleUndoMarkAsPaid(item.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded mt-2"
                          >
                            Undo Mark as Paid
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center">
                      No billing data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-black rounded"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
              className="px-4 py-2 bg-gray-300 text-black rounded"
            >
              Next
            </button>
          </div>
        </CardContent>
      </Card>


      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <div className="space-y-4">
          <div>
            <label htmlFor="companySelect" className="block text-sm font-semibold">Select Company</label>
            <select
              id="companySelect"
              onChange={(e) => handleCompanySelect(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">--Select Company--</option>
              {Array.from(new Set(filteredData.map(item => item.company_name))) 
                .sort()
                .map((companyName) => (
                  <option key={companyName} value={companyName}>
                    {companyName}
                  </option>
              ))}
            </select>
          </div>

          {selectedCompany && previewData.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Preview for {selectedCompany}</h3>
              <Table>
                <TableBody>
                  {previewData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.tenant}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{item.service}</TableCell>
                      <TableCell>{item.property_title}</TableCell>
                      <TableCell>{item.isSettled ? "Paid" : "Unpaid"}</TableCell>
                      <TableCell>{item.isOfficial ? "Yes" : "No"}</TableCell>
                      <TableCell>₱{item.amount.toFixed(2)}</TableCell>
                      <TableCell>₱{item.amountToBeCollected.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 text-right">
                <p>Total Amount to be Collected (Official Items): ₱{" "}{new Intl.NumberFormat("en-PH", {
                                        style: "decimal",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                      }).format(totalAmountToBeCollected)}</p>
                
                <button
                  onClick={() => handleGeneratePDF(selectedCompany)}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Generate PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

export default CompanyBillingTab;
