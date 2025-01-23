document.addEventListener('DOMContentLoaded', function() {
    const annualSalaryInput = document.getElementById('annual-salary');
    const ttoToggle = document.getElementById('tto-toggle');
    const ttoAmountInput = document.getElementById('tto-amount');
    const ttoAppliedSalarySpan = document.getElementById('tto-applied-salary');
    const dailyRateSpan = document.getElementById('daily-rate');
    const daysRequestedInput = document.getElementById('days-requested');
    const totalLoanSpan = document.getElementById('total-loan');
    const repaymentPeriodInput = document.getElementById('repayment-period');
    const monthlyDeductionsSpan = document.getElementById('monthly-deductions');
    const ttoSection = document.querySelector('.tto-section');

    function formatNumber(num) {
      return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    function calculateTTOAppliedSalary() {
      const annualSalary = parseFloat(annualSalaryInput.value.replace(/,/g, '')) || 0;
      const ttoAmount = ttoToggle.checked ? (parseFloat(ttoAmountInput.value) || 52) : 52;
      const weeklySalary = annualSalary / 52;
      const ttoAppliedSalary = weeklySalary * ttoAmount;

      const formattedTTOAppliedSalary = formatNumber(ttoAppliedSalary);
      ttoAppliedSalarySpan.textContent = formattedTTOAppliedSalary;
      calculateDailyRate(ttoAppliedSalary);
    }

    function calculateDailyRate(ttoAppliedSalary) {
      const dailyRate = (ttoAppliedSalary / 365) * 7 / 5;
      dailyRateSpan.textContent = formatNumber(dailyRate);
      calculateTotalLoan(dailyRate);
    }

    function calculateTotalLoan(dailyRate) {
      const daysRequested = parseFloat(daysRequestedInput.value) || 0;
      const totalLoan = dailyRate * daysRequested;
      totalLoanSpan.textContent = formatNumber(totalLoan);
      calculateMonthlyDeductions(totalLoan);
    }

    function calculateMonthlyDeductions(totalLoan) {
      const repaymentPeriod = parseFloat(repaymentPeriodInput.value) || 1;
      const monthlyDeductions = totalLoan / repaymentPeriod;
      monthlyDeductionsSpan.textContent = formatNumber(monthlyDeductions);
    }

    function toggleTTO() {
      if (ttoToggle.checked) {
        ttoAmountInput.disabled = false;
        ttoSection.classList.remove('disabled');
      } else {
        ttoAmountInput.disabled = true;
        ttoSection.classList.add('disabled');
        ttoAmountInput.value = ''; // Clear the TTO Amount if not in use
      }
      calculateTTOAppliedSalary();
    }

    annualSalaryInput.addEventListener('input', calculateTTOAppliedSalary);
    ttoAmountInput.addEventListener('input', calculateTTOAppliedSalary);
    daysRequestedInput.addEventListener('input', function() {
      const dailyRate = parseFloat(dailyRateSpan.textContent.replace(/,/g, '')) || 0;
      calculateTotalLoan(dailyRate);
    });
    repaymentPeriodInput.addEventListener('input', function() {
      const totalLoan = parseFloat(totalLoanSpan.textContent.replace(/,/g, '')) || 0;
      calculateMonthlyDeductions(totalLoan);
    });
    ttoToggle.addEventListener('change', toggleTTO);
    toggleTTO(); // Initialize the state on page load
  });



function getFormData() {
    return {
        employeeName: document.getElementById('employee-name').value,
        annualSalary: document.getElementById('annual-salary').value,
        ttoToggle: document.getElementById('tto-toggle').checked,
        ttoAmount: document.getElementById('tto-amount').value,
        ttoAppliedSalary: document.getElementById('tto-applied-salary').textContent,
        dailyRate: document.getElementById('daily-rate').textContent,
        daysRequested: document.getElementById('days-requested').value,
        totalLoan: document.getElementById('total-loan').textContent,
        repaymentPeriod: document.getElementById('repayment-period').value,
        monthlyDeductions: document.getElementById('monthly-deductions').textContent,
    };
}

function generatePDF(formData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Leave Plus Form", 40, 10);
    doc.text(`Employee Name: ${formData.employeeName}`, 40, 20);
    doc.text(`Annual Salary: ${formData.annualSalary}`, 40, 30);
    doc.text(`Use TTO Amount: ${formData.ttoToggle}`, 40, 40);
    doc.text(`TTO Amount: ${formData.ttoAmount}`, 40, 50);
    doc.text(`Annual Salary (TTO Applied): ${formData.ttoAppliedSalary}`, 40, 60);
    doc.text(`Daily Rate: ${formData.dailyRate}`, 40, 70);
    doc.text(`Number of Days Requested: ${formData.daysRequested}`, 40, 80);
    doc.text(`Total Loan: ${formData.totalLoan}`, 40, 90);
    doc.text(`Repayment Period (months): ${formData.repaymentPeriod}`, 40, 100);
    doc.text(`Monthly Deductions: ${formData.monthlyDeductions}`, 40, 110);
    doc.setFont("helvetica", "bold"); // Set font to Helvetica and style to bold
    doc.setFontSize(12); // Set font size to 12

    return doc;
}

function downloadPDF() {
    const formData = getFormData();
    const doc = generatePDF(formData);
    
    // Save the PDF
    doc.save('LeavePlusForm.pdf');
}
