
const incomeBtn = document.getElementById('incomeBtn');
const expenseBtn = document.getElementById('expenseBtn');

const descriptionInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');

const incomeList = document.getElementById('incomeList');
const expenseList = document.getElementById('expenseList');
const balanceField = document.getElementById('balance');

const incomes = [];
const expenses = [];
const emptyValueErrorText = 'fältet kan inte vara tomt';
const notANumberErrorText = 'värdet ska vara ett tal';
const amountErrorText = 'värdet ska vara större än 0';
const errorClass ='error';

if (incomeBtn && incomeList) { 
  incomeBtn.addEventListener('click', getAddToListFn(incomes, incomeList));
}
if (expenseBtn && expenseList) {
  expenseBtn.addEventListener('click', getAddToListFn(expenses, expenseList));
}
if (amountInput) {
  amountInput.addEventListener('input', isAmountValid);
}
if (descriptionInput) {
  descriptionInput.addEventListener('input', isDescriptionValid);
}


function getAddToListFn(list, listElement) {
  return () => {
    if (!descriptionInput) descriptionInput = document.getElementById('desc');
    if (!amountInput) amountInput = document.getElementById('amount');
    if (! descriptionInput || !amountInput) return;

    if (!isValuesValid()) return;

    const description = descriptionInput.value;
    const amount = Number(amountInput.value);

    list.push({
      description,
      amount
    });

    renderList(list, listElement);
    updateSaldo();
    descriptionInput.value = '';
    amountInput.value = '';
  }
}

function isValuesValid() {
  const isValidDescription = isDescriptionValid();
  const isValidAmount = isAmountValid();

  return  isValidDescription && isValidAmount;
}

function isAmountValid() {
  removeError(amountInput);
  const value = Number(amountInput.value);

  if (amountInput.value === '') {
    renderError(emptyValueErrorText, amountInput);
    return false;
  } else if (isNaN(value)) {
    renderError(notANumberErrorText, amountInput);
    return false;
  } else if (value < 1) {
    renderError(amountErrorText, amountInput);
    return false;
  } 

  return true;
}

function isDescriptionValid() {
  removeError(descriptionInput);
  const isValid = !!descriptionInput.value;

  if (!isValid) renderDescriptionError();

  return isValid;
}

function renderDescriptionError() {
  renderError(emptyValueErrorText, descriptionInput);
}

function removeError(inputElement) {
  inputElement.style.backgroundColor = '#ffffff';
  const error = inputElement.parentElement.querySelector('.error');

  if (!error) return;

  error.remove();
}

function renderError(errorText, inputElement) {
  inputElement.style.backgroundColor = '#f6e3e3';
  const err = document.createElement('p');
  const style = err.style;

  err.classList.add(errorClass);
  err.textContent = errorText;
  style.color = '#c30000';
  style.fontSize = '13px'
  style.position = 'absolute';
  style.bottom = '-14px';
  style.left = '13px';

  inputElement.parentElement.appendChild(err);
}

function renderList(list, listElement) {
  listElement.replaceChildren(
    ...( list.map(item => createLiEl(item, list)) )
  );
}

function createLiEl(item, list) {
  const li = document.createElement('li');
  li.textContent = `${item.description} - ${item.amount} kr (${list === incomes ? 'Inkomst' : 'Utgift'})`;

  return li;
}

function updateSaldo() {
  if (!balanceField) balanceField = document.getElementById('balance');
  if (!balanceField) return;

  const sumIncome = getListSum(incomes);
  const sumExpense = getListSum(expenses);

  balanceField.textContent = sumIncome - sumExpense;
}

function getListSum(list) {
  let sum = 0;

  for (let i = 0; i < list.length; i += 1) {
    if (list[i].amount) sum += list[i].amount;
  }

  return sum;
}
