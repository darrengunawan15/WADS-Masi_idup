import React, { Component } from "react";

class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProblem: "",
      complaintText: "",
      uploadedImage: null,
      currentPage: "ticketList",
      tickets: [
        { ticketId: "#12345", customerId: "C001", username: "john_doe", issue: "Issue Refund", status: "Pending", dateIssued: "2025-04-27" },
        { ticketId: "#12346", customerId: "C002", username: "jane_smith", issue: "Wrong Order", status: "Resolved", dateIssued: "2025-04-26" },
        { ticketId: "#12347", customerId: "C003", username: "mike_lee", issue: "Have not received order", status: "Pending", dateIssued: "2025-04-25" }
      ]
    };
  }

  handleSelectProblem = (problem) => {
    this.setState({ selectedProblem: problem, currentPage: "ticketForm" });
  };

  handleImageUpload = (event) => {
    const file = event.target.files[0];
    this.setState({ uploadedImage: file });
  };

  handleComplaintChange = (event) => {
    const text = event.target.value;
    const words = text.trim().split(/\s+/);
    if (words.length <= 50) {
      this.setState({ complaintText: text });
    }
  };

  handleSubmit = () => {
    const { selectedProblem, complaintText, uploadedImage } = this.state;
    console.log("Problem:", selectedProblem);
    console.log("Complaint:", complaintText);
    console.log("Uploaded Image:", uploadedImage);
    this.setState({ currentPage: "confirmation" });
  };

  handleGoBack = () => {
    this.setState({
      selectedProblem: "",
      complaintText: "",
      uploadedImage: null,
      currentPage: "ticketList",  // Go back to the ticket list page
    });
  };

  handleNewTicket = () => {
    this.setState({
      currentPage: "ticketForm",  // Go to the ticket form page
    });
  };

  render() {
    const { selectedProblem, complaintText, uploadedImage, currentPage, tickets } = this.state;

    const problems = ["Issue Refund", "Wrong Order", "Have not received order"];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: "var(--babypink)" }}>
        <h1 className="text-white text-7xl font-bold mb-15">My Ticket</h1>

        {currentPage === "ticketList" && (
          <>
            <div className="overflow-x-auto rounded-lg shadow-lg mb-8 w-full max-w-4xl">
              <table className="min-w-full table-auto rounded-lg border-collapse">
                <thead style={{ backgroundColor: "var(--hotpink)" }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Ticket Number</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Customer ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Username</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Issue</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Date Issued</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.ticketId} className="border-t bg-white">
                      <td className="px-6 py-4 text-sm text-gray-700">{ticket.ticketId}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{ticket.customerId}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{ticket.username}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{ticket.issue}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{ticket.status}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{ticket.dateIssued}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 mt-8">
              <button
                className="px-7 py-3 text-white rounded-2xl font-semibold transition"
                style={{ backgroundColor: "var(--roseberry)" }}
                onClick={this.handleNewTicket}  // Go to the ticket form
              >
                Create Ticket
              </button>
            </div>
          </>
        )}

        {currentPage === "ticketForm" && !selectedProblem && (
          <div className="p-6 rounded-2xl w-150 shadow-lg" style={{ backgroundColor: "var(--hotpink)" }}>
            <h3 className="text-white font-bold mb-6 text-xl">Select The Problem</h3>
            <div className="flex flex-col gap-4">
              {problems.map((problem) => (
                <div
                  key={problem}
                  onClick={() => this.handleSelectProblem(problem)}
                  className="p-3 rounded-lg cursor-pointer bg-white h-14 text-gray-400 text-xl hover:border-4 transition"
                >
                  {problem}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === "ticketForm" && selectedProblem && (
          <div className="bg-white p-8 rounded-2xl w-full max-w-4xl shadow-lg flex flex-col md:flex-row gap-8">
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-200 rounded-2xl p-6">
              {uploadedImage ? (
                <img
                  src={URL.createObjectURL(uploadedImage)}
                  alt="Uploaded Preview"
                  className="w-40 h-40 object-cover rounded-xl"
                />
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1828/1828925.png"
                    alt="Upload Icon"
                    className="w-20 h-20 mb-4 opacity-70"
                  />
                  <span className="font-semibold text-gray-700">Upload Image</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={this.handleImageUpload}
                  />
                </label>
              )}
            </div>

            <div className="flex-1 rounded-2xl p-6" style={{ backgroundColor: "var(--hotpink)" }}>
              <h3 className="text-white font-semibold mb-4">
                Type in your complaints (Max 50 words)
              </h3>
              <textarea
                value={complaintText}
                onChange={this.handleComplaintChange}
                placeholder="Type your complaint here..."
                className="w-full h-48 p-4 rounded-lg resize-none outline-none bg-white"
              />
            </div>
          </div>
        )}

        {currentPage === "confirmation" && (
          <div className="bg-white p-8 rounded-2xl w-full max-w-4xl shadow-lg flex flex-col items-center justify-center">
            <h2 className="text-3xl font-semibold text-gray-700">Your ticket has been submitted!</h2>
            <p className="text-gray-600 mt-4">We will get back to you as soon as possible.</p>

            <div className="flex flex-col gap-4 mt-8">
              <button
                className="px-9 py-3 text-white rounded-2xl font-semibold transition"
                style={{ backgroundColor: "var(--roseberry)" }}
                onClick={this.handleGoBack}  // Go back to the ticket list
              >
                Back to Tickets
              </button>
            </div>
          </div>
        )}

        {(currentPage === "ticketForm" || currentPage === "confirmation") && (
          <div className="flex flex-col gap-4 mt-8">
            <button
              className="px-9 py-3 text-white rounded-2xl font-semibold transition"
              style={{ backgroundColor: "var(--roseberry)" }}
              onClick={this.handleGoBack}  // Go back to the ticket list
            >
              Go Back
            </button>
            {selectedProblem && (
            <button
              className="px-9 py-3 text-white rounded-2xl font-semibold transition"
              style={{ backgroundColor: "var(--roseberry)" }}
              onClick={this.handleSubmit}
            >
              Submit
            </button>
          )}
          </div>
        )}
      </div>
    );
  }
}

export default Ticket;
