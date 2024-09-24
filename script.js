let totalIncome = 0;
let totalExpenses = 0;
const expenses = [];

// Function to update the remaining balance
function updateRemainingBalance() {
    const totalSavings = parseFloat(document.getElementById('total-savings').textContent) || 0;
    const remainingBalance = totalIncome - totalExpenses - totalSavings;
    document.getElementById('remaining-balance').textContent = remainingBalance.toFixed(2);
}

// Function to add expense to the list
function addExpenseToList(name, amount, category, date) {
    const expenseList = document.getElementById('expense-list');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${name}</td>
        <td>₹${amount.toFixed(2)}</td>
        <td>${category}</td>
        <td>${date}</td>
        <td><button class="delete-button">Delete</button></td>
    `;

    expenseList.appendChild(row);

    // Add delete functionality
    row.querySelector('.delete-button').addEventListener('click', function() {
        totalExpenses -= amount;
        document.getElementById('total-amount').textContent = totalExpenses.toFixed(2);
        updateRemainingBalance();
        expenseList.removeChild(row);
    });
}

// Function to update the chart
function updateChart() {
    // Your Chart.js update logic here
}

// Update income submission
document.getElementById('income-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const incomeAmount = parseFloat(document.getElementById('income-amount').value);

    if (incomeAmount > 0) {
        fetch('http://localhost:5000/api/income', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: incomeAmount }),
        })
        .then(response => response.json())
        .then(data => {
            totalIncome += incomeAmount;
            document.getElementById('total-income').textContent = totalIncome.toFixed(2);
            updateRemainingBalance();
            document.getElementById('income-form').reset();
        });
    } else {
        alert("Please enter a valid income amount.");
    }
});

// Update expense submission
document.getElementById('expense-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
    const expenseCategory = document.getElementById('expense-category').value;
    const expenseDate = document.getElementById('expense-date').value;

    if (expenseAmount > 0) {
        fetch('http://localhost:5000/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: expenseName, amount: expenseAmount, category: expenseCategory, date: expenseDate }),
        })
        .then(response => response.json())
        .then(data => {
            totalExpenses += expenseAmount;
            expenses.push(data);
            document.getElementById('total-amount').textContent = totalExpenses.toFixed(2);
            addExpenseToList(expenseName, expenseAmount, expenseCategory, expenseDate);
            updateRemainingBalance();
            document.getElementById('expense-form').reset();
            updateChart();
        });
    } else {
        alert("Please enter a valid expense amount.");
    }
});

// Load expenses on page load
document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:5000/api/expenses')
        .then(response => response.json())
        .then(data => {
            data.forEach(expense => {
                totalExpenses += expense.amount;
                expenses.push(expense);
                addExpenseToList(expense.name, expense.amount, expense.category, expense.date);
            });
            document.getElementById('total-amount').textContent = totalExpenses.toFixed(2);
            updateRemainingBalance();
            updateChart();
        });
});
