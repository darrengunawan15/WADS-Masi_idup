import React, { Component } from "react";

class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProblem: "",
      complaintText: "",
      uploadedImage: null,
    };
  }

  handleSelectProblem = (problem) => {
    this.setState({ selectedProblem: problem });
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
    // Add your submit logic here
  };

  handleGoBack = () => {
    this.setState({
      selectedProblem: "",
      complaintText: "",
      uploadedImage: null,
    });
  };

  render() {
    const { selectedProblem, complaintText, uploadedImage } = this.state;

    const problems = ["Issue Refund", "Wrong Order", "Have not receive order"];

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ backgroundColor: "var(--babypink)"}}
      >
        <h1 className="text-white text-7xl font-bold mb-15">My Ticket</h1>

        {!selectedProblem ? (
          <div
            className="p-6 rounded-2xl w-150 shadow-lg"
            style={{ backgroundColor: "var(--hotpink)" }}
          >
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
        ) : (

          <div className="bg-white p-8 rounded-2xl w-full max-w-4xl shadow-lg flex flex-col md:flex-row gap-8">
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-200 rounded-2xl p-6">
              {uploadedImage ? (
                <img
                  src={URL.createObjectURL(uploadedImage)}
                  alt="Uploaded Preview"
                  className="w-40 h-40 object-cover rounded-xl"
                />
              ) : (
                <>
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
                </>
              )}
            </div>

            <div
              className="flex-1 rounded-2xl p-6"
              style={{ backgroundColor: "var(--hotpink)" }}
            >
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

        <div className="flex flex-col gap-4 mt-8">
          <button
            className="px-9 py-3 text-white rounded-2xl font-semibold transition"
            style={{ backgroundColor: "var(--roseberry)" }}
            onClick={this.handleGoBack}
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
      </div>
    );
  }
}

export default Ticket;
