
// DOM elements
const budgetValueField = document.querySelector(".budget__value");
const totalIncValueField = document.querySelector(".budget__income--value");
const totalExpValueField = document.querySelector(".budget__expenses--value");
const totalExpPercentageField = document.querySelector(".budget__expenses--percentage");
const descriptionField = document.querySelector(".add__description");
const valueField = document.querySelector(".add__value");
const typeField = document.querySelector(".add__type");
const addBtn = document.querySelector(".add__btn");

class Expense {
    constructor(id, description, value, percentage) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = percentage;
    }
}

class Income {
    constructor(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
}

class UIController {

    constructor() {

    }

    static chart

    static displayTotalsUI(totals) {
        budgetValueField.innerHTML = `£ ${totals.budget.toFixed(2)}`;
        totalIncValueField.innerHTML = `£ ${totals.inc.toFixed(2)}`;
        totalExpValueField.innerHTML = `£ ${totals.exp.toFixed(2)}`;
        totalExpPercentageField.innerHTML = `${totals.expPercentage.toFixed(2)}%`;
    }

    static resetInputFields() {
        descriptionField.value = "";
        valueField.value = "";
    }

    static getInput() {
        return {
            description: descriptionField.value,
            value: parseFloat(valueField.value)
        }
    }

    static changeBorderColor() {
        typeField.classList.toggle("red-focus");
        descriptionField.classList.toggle("red-focus");
        valueField.classList.toggle("red-focus");
        document.querySelector(".ion-ios-checkmark-outline").classList.toggle("red");
        console.log("changed");
    }

    static addItemUI(item) {
        if (typeField.value === "inc") {
            const html = `<div class="item clearfix" id=${item.id}><div class="item__description">${item.description}</div><div class="right clearfix"><div class="item__value">£ ${item.value.toFixed(2)}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
            document.querySelector(".income__list").insertAdjacentHTML("beforeend", html);
        } else {
            const html = `<div class="item clearfix" id=${item.id}><div class="item__description">${item.description}</div><div class="right clearfix"><div class="item__value">£ ${item.value.toFixed(2)}</div><div class="item__percentage">${item.percentage.toFixed(2)}%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
            document.querySelector(".expenses__list").insertAdjacentHTML("beforeend", html);
        }
    }

    static displayAllExpPercentages(arr) {
        arr.forEach(item => {
            document.querySelector(`#${item.id} .item__percentage`).innerHTML = `${item.percentage.toFixed(2)}%`;
        })

    }

    static deleteItemUI(element, elementType) {
        elementType === "inc"? document.querySelector(".income__list").removeChild(element) : document.querySelector(".expenses__list").removeChild(element);
    }

    static createChart(budgetCtrl) {
        var xValues = ["Budget", "Expenses"];
        var yValues = [budgetCtrl.data.totals.budget, budgetCtrl.data.totals.exp];
        var barColors = [
        "#28B9B5",
        "#FF5049",
        ];

        this.chart = new Chart("myChart", {
        type: "pie",
        data: {
            labels: xValues,
            datasets: [{
            backgroundColor: barColors,
            data: yValues
            }]
        },
        options: {
            title: {
            display: true,
            text: "Budget and expenses"
            }
        }
        });
    }

    static updateChart(chart, budgetCtrl) {
        chart.data.datasets[0].data[0] = budgetCtrl.data.totals.budget;
        chart.data.datasets[0].data[1] = budgetCtrl.data.totals.exp;
        chart.update();
    }
}

class BudgetController {

    constructor() {

    }

    static incID = 0;
    static expID = 0;

    static data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0,
            expPercentage: 0,
            budget: 0
        }
    };

    static createID() {
        if (typeField.value === "inc") {
            this.incID = this.data.allItems.inc.length === 0 ? 0 : ++this.incID;
        } else {
            this.expID = this.data.allItems.exp.length === 0 ? 0 : ++this.expID;
        }
    }

    static createItemBudgetCtrl(id, description, value) {
        const newItem = typeField.value === "inc" ? new Income(id, description, value) : new Expense(id, description, value, -1);
        return newItem;
    }

    static pushNewItemBudgetCtrl(newItem) {
        if (typeField.value === "inc") {
            this.data.allItems.inc.push(newItem);
        } else {
            this.data.allItems.exp.push(newItem);
        }
    }

    static calcTotals(item, operation) {
        const type = item.id.split("-")[0];
        operation === "add"? this.data.totals[type] += item.value : this.data.totals[type] -= item.value;
        this.data.totals.budget = this.data.totals.inc - this.data.totals.exp;
        this.data.totals.expPercentage = (this.data.totals.exp / this.data.totals.inc) * 100;
    }

    static calcExpPercentage(item) {
        item.percentage = (item.value / this.data.totals.inc) * 100;
        console.log(item);
    }

    static updateAllExpPercentages() {
        this.data.allItems.exp.forEach(item => item.percentage = (item.value / this.data.totals.inc) * 100);
        console.log(this.data.allItems.exp);
    }

    static deleteItemBudgetCtrl(elementType, itemIndex) {
        this.data.allItems[elementType].splice(itemIndex, 1);
    }
}

class AppController {
    constructor(UICtrl, BudgetCtrl) {
        this.UICtrl = UICtrl;
        this.BudgetCtrl = BudgetCtrl;
        this.init();
    }

    init() {
        this.UICtrl.displayTotalsUI(this.BudgetCtrl.data.totals);
        this.setDate();
        this.setUpEventListeners();
        this.UICtrl.createChart(this.BudgetCtrl);
    }

    setDate() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const date = new Date();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        document.querySelector(".budget__title--month").innerHTML = `${month} ${year}`;
    }

    setUpEventListeners() {
        addBtn.addEventListener("click", this.ctrlAddItem.bind(this));
        valueField.addEventListener("keydown", this.ctrlAddItem.bind(this));
        descriptionField.addEventListener("keydown", this.ctrlAddItem.bind(this));
        document.querySelector(".container").addEventListener("click", this.ctrlDeleteItem.bind(this));
        typeField.addEventListener("change", this.UICtrl.changeBorderColor.bind(this));
    }

    ctrlAddItem(event) {
        if (event.key === "Enter" || event.type === "click") {
            if (valueField.value === "" || descriptionField.value === "") {
                alert("Please add a description and an amount");
            } else {
                const description = this.UICtrl.getInput().description;
                const value = this.UICtrl.getInput().value;
                if(typeField.value === "exp" && value > this.BudgetCtrl.data.totals.budget) {
                    alert("The expense is greater than the budget, please modify the amount");
                    return;
                }
                if(value < 0) {
                    alert("The amount needs to be positive");
                    return;
                }
                this.BudgetCtrl.createID();
                const id = typeField.value === "inc" ? `inc-${this.BudgetCtrl.incID}` : `exp-${this.BudgetCtrl.expID}`;
                const newItem = this.BudgetCtrl.createItemBudgetCtrl(id, description, value);
                this.BudgetCtrl.pushNewItemBudgetCtrl(newItem);
                this.BudgetCtrl.calcTotals(newItem, "add");
                if (typeField.value === "exp") {
                    this.BudgetCtrl.calcExpPercentage(newItem);
                }
                if (typeField.value === "inc") {
                    this.BudgetCtrl.updateAllExpPercentages();
                    this.UICtrl.displayAllExpPercentages(this.BudgetCtrl.data.allItems.exp);
                }
                this.UICtrl.addItemUI(newItem);
                this.UICtrl.displayTotalsUI(this.BudgetCtrl.data.totals);
                this.UICtrl.updateChart(this.UICtrl.chart, this.BudgetCtrl);
                this.UICtrl.resetInputFields();
                descriptionField.focus();
            }
        }
    }

    ctrlDeleteItem(event) {
        if (event.target.className === "ion-ios-close-outline") {
            const element = event.target.closest(".item");
            const elementID = element.getAttribute("id");
            const elementType = element.getAttribute("id").split("-")[0];
            const itemIndex = this.BudgetCtrl.data.allItems[elementType].findIndex((item) => item.id === elementID);
            const item = this.BudgetCtrl.data.allItems[elementType][itemIndex];
            this.UICtrl.deleteItemUI(element, elementType);
            this.BudgetCtrl.deleteItemBudgetCtrl(elementType, itemIndex);
            this.BudgetCtrl.calcTotals(item, "delete");
            this.UICtrl.displayTotalsUI(this.BudgetCtrl.data.totals);
            this.UICtrl.updateChart(this.UICtrl.chart, this.BudgetCtrl);
        }
    }
}

const appController = new AppController(UIController, BudgetController);