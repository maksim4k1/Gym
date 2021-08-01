const URL = "http://localhost:3030/gym";

let inventoryItems;
let trainersItems;
const inventoryList = document.querySelector(".inventory__list");
const trainersList = document.querySelector(".trainers__list");
const createInventoryButton = document.querySelector(".inventory__create-inventory");
const createTrainersButton = document.querySelector(".trainers__create-trainers");
const sortItems = document.querySelectorAll(".sort-label");
const modal = document.querySelector(".modal");
const modalForm = document.querySelector(".modal__form");

function createInventoryItem(inventoryItem){
    const item = createElement("li", "inventory__item item");
    const name = createElement("div", "inventory__name name", `${inventoryItem.name}`);
    const isInGoodContion = createElement("div", "inventory__info info", `<b>Качество:</b> ${inventoryItem.isInGoodContion ? "Хорошее" : "Плохое"}`);
    const quantity = createElement("div", "inventory__info info", `<b>Количество:</b> ${inventoryItem.quantity} шт.`);
    const weight = createElement("div", "inventory__info info", `<b>Вес:</b> ${inventoryItem.weight} кг`);
    const producedBy = createElement("div", "inventory__info info", `<b>Производитель:</b> ${inventoryItem.producedBy}`);
    const buttons = createElement("div", "inventory__buttons buttons");
    const editItem = createElement("button", "inventory__edit edit", "Редактировать");
    const deleteItem = createElement("button", "inventory__delete delete", "Удалить");

    buttons.append(editItem, deleteItem);
    item.append(name, isInGoodContion, quantity, weight, producedBy, buttons);

    item.addEventListener("click", (event) => {
        if(event.target !== editItem && event.target !== deleteItem){
            openModal("getInventory", {id: inventoryItem.id});
        }
    });
    editItem.addEventListener("click", () => {
        openModal("updateInventoryItem", {id: inventoryItem.id});
    });
    deleteItem.addEventListener("click", () => {
        openModal("deleteInventoryItem", {id: inventoryItem.id});
    });

    return item;
}

function createTrainersItem(trainersItem){
    let lastAgeNumber = trainersItem.age % 10;
    let ageText = "лет";
    if(lastAgeNumber === 1){
        ageText = "год";
    } else if(lastAgeNumber === 2 || lastAgeNumber === 3 || lastAgeNumber === 4){
        ageText = "года";
    }
    const item = createElement("li", "trainers__item item");
    const name = createElement("div", "trainers__name name", `${trainersItem.name}`);
    const age = createElement("div", "trainers__info info", `<b>Возраст:</b> ${trainersItem.age} ${ageText}`);
    const specialization = createElement("div", "trainers__info info", `<b>Специализация:</b> ${trainersItem.specialization}`);
    const wage = createElement("div", "trainers__info info", `<b>Зарплата:</b> ${trainersItem.wage} сом`);
    const buttons = createElement("div", "trainers__buttons buttons");
    const editItem = createElement("button", "trainers__edit edit", "Редактировать");
    const deleteItem = createElement("button", "trainers__delete delete", "Удалить");

    buttons.append(editItem, deleteItem);
    item.append(name, age, specialization, wage, buttons);

    item.addEventListener("click", (event) => {
        if(event.target !== editItem && event.target !== deleteItem){
            openModal("getTrainers", {id: trainersItem.id});
        }
    });
    editItem.addEventListener("click", () => {
        openModal("updateTrainersItem", {id: trainersItem.id});
    });
    deleteItem.addEventListener("click", () => {
        openModal("deleteTrainersItem", {id: trainersItem.id});
    });

    return item;
}

sortItems.forEach(item => {
    let itemInput = item.childNodes[1];
    if(itemInput.name === "sortTrainers"){
        item.addEventListener("click", () => {
            getData("trainers");
        });
    } else if(itemInput.name === "sortInventory"){
        item.addEventListener("click", () => {
            getData("inventory");
        });
    }
});
function renderItems(list, items){
    list.innerHTML = "";
    list.append(...items);
}

createInventoryButton.addEventListener("click", () => {
    openModal("addInventory");
});

createTrainersButton.addEventListener("click", () => {
    openModal("addTrainers");
});

modalForm.addEventListener("submit", (event) => {
    event.preventDefault();
});
modal.addEventListener("click", (event) => {
    if(event.target === event.currentTarget){
        closeModal();
    }
});

// Inputs
let modalButton;
let modal__inputName;
let modal__inputIsInGoodCondition;
let modal__inputQuantity;
let modal__inputWeight;
let modal__inputProducedBy;
let modal__inputAge;
let modal__inputSpecialization;
let modal__inputWage;

async function openModal(form, values){
    modalForm.innerHTML = "";
    modal.classList.add("open-modal");
    document.body.classList.add("body-overflow");

    if(form === "addInventory"){
        const title = createElement("h6", "modal__title", "Добавить");
        const button = createElement("button", "modal__button button", "Добавить");
        const errorBlock = createElement("button", "modal__error");
        const labelName = createElement("label", "modal__label", "Введите имя спорт товара");
        const inputName = createElement("input", "modal__input modal__input-name");
        const labelIsInGoodContion = createElement("label", "modal__label", "Введите качество (Хорошее/Плохое)");
        const inputIsInGoodContion = createElement("input", "modal__input modal__input-isInGoodCondition");
        const labelQuantity = createElement("label", "modal__label", "Введите количество");
        const inputQuantity = createElement("input", "modal__input modal__input-quantity");
        const labelWeight = createElement("label", "modal__label", "Введите вес");
        const inputWeight = createElement("input", "modal__input modal__input-weight");
        const labelProducedBy = createElement("label", "modal__label", "Введите производителя");
        const inputProducedBy = createElement("input", "modal__input modal__input-producedBy");

        inputIsInGoodContion.setAttribute("type", "checkbox");
        inputQuantity.setAttribute("type", "number");
        inputWeight.setAttribute("type", "number");
        labelName.append(inputName);
        labelIsInGoodContion.append(inputIsInGoodContion);
        labelQuantity.append(inputQuantity);
        labelWeight.append(inputWeight);
        labelProducedBy.append(inputProducedBy);

        modalForm.append(title, labelName, labelIsInGoodContion, labelQuantity, labelWeight, labelProducedBy, errorBlock, button);

        modalButton = document.querySelector(".modal__button");
        modal__inputName = document.querySelector(".modal__input-name");
        modal__inputIsInGoodCondition = document.querySelector(".modal__input-isInGoodCondition");
        modal__inputQuantity = document.querySelector(".modal__input-quantity");
        modal__inputWeight = document.querySelector(".modal__input-weight");
        modal__inputProducedBy = document.querySelector(".modal__input-producedBy");
        modalButton.addEventListener("click", () => {
            validateForm();
            if(errorBlock.textContent === ""){
                createInventoryElement({
                    name: inputName.value,
                    isInGoodContion: inputIsInGoodContion.checked,
                    quantity: inputQuantity.value,
                    weight: inputWeight.value,
                    producedBy: inputProducedBy.value
                });
                closeModal();
            }
        });
    } else if(form === "getInventory"){
        let item = await getDataById("inventory", values.id);
        const title = createElement("h6", "modal__title", item.name);
        const isInGoodContion = createElement("div", "modal__info", `<b>Качество:</b> ${item.isInGoodContion ? "Хорошее" : "Плохое"}`);
        const quantity = createElement("div", "modal__info", `<b>Количество:</b> ${item.quantity}`);
        const weight = createElement("div", "modal__info", `<b>Вес:</b> ${item.weight}`);
        const producedBy = createElement("div", "modal__info", `<b>Производитель:</b> ${item.producedBy}`);
        
        modalForm.append(title, isInGoodContion, quantity, weight, producedBy);
    } else if(form === "deleteInventoryItem"){
        const title = createElement("h6", "modal__title", "Вы уверены что хотите удалить этот спорт товар?");
        const errorBlock = createElement("button", "modal__error");
        const button = createElement("button", "modal__button modal__delete-button button", "Удалить");

        modalForm.append(title, errorBlock, button);

        modalButton = document.querySelector(".modal__button");
        modalButton.addEventListener("click", () => {
            closeModal();
            deleteDataItem("inventory", values.id);
        });
    } else if(form === "updateInventoryItem"){
        let item = await getDataById("inventory", values.id);
        const title = createElement("h6", "modal__title", `Изменить ${item.name}`);
        const button = createElement("button", "modal__button button", "Изменить");
        const errorBlock = createElement("button", "modal__error");
        const labelName = createElement("label", "modal__label", "Введите имя спорт товара");
        const inputName = createElement("input", "modal__input modal__input-name");
        const labelIsInGoodContion = createElement("label", "modal__label", "Качество (Хорошее/Плохое)");
        const inputIsInGoodContion = createElement("input", "modal__input modal__input-isInGoodCondition");
        const labelQuantity = createElement("label", "modal__label", "Введите количество");
        const inputQuantity = createElement("input", "modal__input modal__input-quantity");
        const labelWeight = createElement("label", "modal__label", "Введите вес");
        const inputWeight = createElement("input", "modal__input modal__input-weight");
        const labelProducedBy = createElement("label", "modal__label", "Введите производителя");
        const inputProducedBy = createElement("input", "modal__input modal__input-producedBy");

        inputIsInGoodContion.setAttribute("type", "checkbox");
        inputQuantity.setAttribute("type", "number");
        inputWeight.setAttribute("type", "number");
        if(item.isInGoodContion === true){
            inputIsInGoodContion.setAttribute("checked", "");
        }
        inputName.setAttribute("value", item.name);
        inputIsInGoodContion.setAttribute("value", item.isInGoodContion);
        inputQuantity.setAttribute("value", item.quantity);
        inputWeight.setAttribute("value", item.weight);
        inputProducedBy.setAttribute("value", item.producedBy);
        labelName.append(inputName);
        labelIsInGoodContion.append(inputIsInGoodContion);
        labelQuantity.append(inputQuantity);
        labelWeight.append(inputWeight);
        labelProducedBy.append(inputProducedBy);

        modalForm.append(title, labelName, labelIsInGoodContion, labelQuantity, labelWeight, labelProducedBy, errorBlock, button);

        modalButton = document.querySelector(".modal__button");
        modal__inputIsInGoodCondition = document.querySelector(".modal__input-isInGoodCondition");
        modal__inputQuantity = document.querySelector(".modal__input-quantity");
        modalButton.addEventListener("click", () => {
            validateForm();
            if(errorBlock.textContent === ""){
                updateInventoryItem({name: inputName.value, isInGoodContion: inputIsInGoodContion.checked, quantity: inputQuantity.value, weight: inputWeight.value, producedBy: inputProducedBy.value}, item.id);
                closeModal();
            }
        });
    } else if(form === "addTrainers"){
        const title = createElement("h6", "modal__title", "Добавить");
        const button = createElement("button", "modal__button button", "Добавить");
        const errorBlock = createElement("button", "modal__error");
        const labelName = createElement("label", "modal__label", "Введите имя тренера");
        const inputName = createElement("input", "modal__input modal__input-name");
        const labelAge = createElement("label", "modal__label", "Введите возраст тренера");
        const inputAge = createElement("input", "modal__input modal__input-age");
        const labelSpecialization = createElement("label", "modal__label", "Введите специализацию");
        const inputSpecialization = createElement("input", "modal__input modal__input-specialization");
        const labelWage = createElement("label", "modal__label", "Введите зарплату тренера");
        const inputWage = createElement("input", "modal__input modal__input-wage");

        inputAge.setAttribute("type", "number");
        inputWage.setAttribute("type", "number");
        labelName.append(inputName);
        labelAge.append(inputAge);
        labelSpecialization.append(inputSpecialization);
        labelWage.append(inputWage);

        modalForm.append(title, labelName, labelAge, labelSpecialization, labelWage, errorBlock, button);

        modalButton = document.querySelector(".modal__button");
        modal__inputName = document.querySelector(".modal__input-name");
        modal__inputAge = document.querySelector(".modal__input-age");
        modal__inputSpecialization = document.querySelector(".modal__input-specialization");
        modal__inputWage = document.querySelector(".modal__input-wage");
        modalButton.addEventListener("click", () => {
            validateForm();
            if(errorBlock.textContent === ""){
                createTrainersElement({
                    name: inputName.value,
                    age: inputAge.value,
                    specialization: inputSpecialization.value,
                    wage: inputWage.value
                });
                closeModal();
            }
        });
    } else if(form === "getTrainers"){
        let item = await getDataById("trainers", values.id);
        const title = createElement("h6", "modal__title", item.name);
        const age = createElement("div", "modal__info", `<b>Возраст:</b> ${item.age}`);
        const specialization = createElement("div", "modal__info", `<b>Специализация:</b> ${item.specialization}`);
        const wage = createElement("div", "modal__info", `<b>Зарплата:</b> ${item.wage}`);
        
        modalForm.append(title, age, specialization, wage);
    } else if(form === "deleteTrainersItem"){
        const title = createElement("h6", "modal__title", "Вы уверены что хотите удалить этого тренера?");
        const errorBlock = createElement("button", "modal__error");
        const button = createElement("button", "modal__button modal__delete-button button", "Удалить");

        modalForm.append(title, errorBlock, button);

        modalButton = document.querySelector(".modal__button");
        modalButton.addEventListener("click", () => {
            closeModal();
            deleteDataItem("trainers", values.id);
        });
    } else if(form === "updateTrainersItem"){
        let item = await getDataById("trainers", values.id);
        const title = createElement("h6", "modal__title", `Изменить ${item.name}`);
        const button = createElement("button", "modal__button button", "Изменить");
        const errorBlock = createElement("button", "modal__error");
        const labelName = createElement("label", "modal__label", "Имя");
        const inputName = createElement("input", "modal__input modal__input-name");
        const labelAge = createElement("label", "modal__label", "Возраст");
        const inputAge = createElement("input", "modal__input modal__input-age");
        const labelSpecialization = createElement("label", "modal__label", "Введите специализацию");
        const inputSpecialization = createElement("input", "modal__input modal__input-specialization");
        const labelWage = createElement("label", "modal__label", "Введите зарплату");
        const inputWage = createElement("input", "modal__input modal__input-wage");

        inputName.setAttribute("value", item.name);
        inputAge.setAttribute("type", "number");
        inputAge.setAttribute("value", item.age);
        inputSpecialization.setAttribute("value", item.specialization);
        inputWage.setAttribute("value", item.wage);
        inputWage.setAttribute("type", "number");
        labelName.append(inputName);
        labelAge.append(inputAge);
        labelSpecialization.append(inputSpecialization);
        labelWage.append(inputWage);

        modalForm.append(title, labelName, labelAge, labelSpecialization, labelWage, errorBlock, button);

        modalButton = document.querySelector(".modal__button");
        modal__inputName = document.querySelector(".modal__input-name");
        modal__inputAge = document.querySelector(".modal__input-age");
        modal__inputSpecialization = document.querySelector(".modal__input-specialization");
        modal__inputWage = document.querySelector(".modal__input-wage");
        modalButton.addEventListener("click", () => {
            validateForm();
            if(errorBlock.textContent === ""){
                updateTrainersItem({name: inputName.value, age: inputAge.value, specialization: inputSpecialization.value, wage: inputWage.value}, item.id);
                closeModal();
            }
        });
    }
}

function validateForm(){
    let inputs = document.querySelectorAll(".modal__input");
    let errorBlock = document.querySelector(".modal__error");
    let isHasError = false;
    inputs.forEach(item => {
        if(item.value === "" && item.getAttribute("type") !== "checkbox"){
            isHasError = true;
        }
    });
    if(isHasError === true){
        errorBlock.textContent = "Заполните все поля";
    } else{
        errorBlock.textContent = "";
    }
}

function createElement(tag="div", className="", text=""){
    let block = document.createElement(tag);
    block.className = className;
    block.innerHTML = text;
    return block;
}

function closeModal(){
    modalForm.innerHTML = "";
    modal.classList.remove("open-modal");
    document.body.classList.remove("body-overflow");
}

function getData(route){
    fetch(`${URL}/${route}`)
        .then(response => response.json())
        .then(data => {
            if(route === "inventory"){
                let sortInventoryType = document.querySelector(".inventory__sort-inventory-input:checked").value;
                if(sortInventoryType === "alphabet"){
                    data.sort(function (a, b) {
                        if (a.name > b.name) return 1;
                        else if (a.name < b.name) return -1;
                        else return 0;
                    });
                } else if(sortInventoryType === "quantity"){
                    data.sort(function (a, b) {
                        if (a.quantity > b.quantity) return -1;
                        else if (a.quantity < b.quantity) return 1;
                        else return 0;
                    });
                }
                inventoryItems = data.map(item => createInventoryItem(item));
                renderItems(inventoryList, inventoryItems);
            } else if(route === "trainers"){
                let sortTrainersType = document.querySelector(".trainers__sort-trainers-input:checked").value;
                if(sortTrainersType === "alphabet"){
                    data.sort(function (a, b) {
                        if (a.name > b.name) return 1;
                        else if (a.name < b.name) return -1;
                        else return 0;
                    });
                } else if(sortTrainersType === "wage"){
                    data.sort(function (a, b) {
                        if (a.wage > b.wage) return -1;
                        else if (a.wage < b.wage) return 1;
                        else return 0;
                    });
                }
                trainersItems = data.map(item => createTrainersItem(item));
                renderItems(trainersList, trainersItems);
            }
        });
}

async function getDataById(route, id){
    let response = await fetch(`${URL}/${route}/${id}`);
    let data = await response.json();
    return data;
}

async function createInventoryElement(item){
    const object = {
        name: item.name,
        isInGoodContion: item.isInGoodContion,
        quantity: Number(item.quantity),
        weight: Number(item.weight),
        producedBy: item.producedBy
    }
    await fetch(`${URL}/inventory/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(object)
    });
    getData("inventory");
}

async function createTrainersElement(item){
    const object = {
        name: item.name,
        age: Number(item.age),
        specialization: item.specialization,
        wage: Number(item.wage)
    }
    await fetch(`${URL}/trainers/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(object)
    });
    getData("trainers");
}

async function updateInventoryItem(values, id){
    let object = {
        name: values.name,
        isInGoodContion: values.isInGoodContion,
        quantity: Number(values.quantity),
        weight: Number(values.weight),
        producedBy: values.producedBy
    }
    await fetch(`${URL}/inventory/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(object)
    });
    getData("inventory");
}

async function updateTrainersItem(values, id){
    let object = {
        name: values.name,
        age: Number(values.age),
        specialization: values.specialization,
        wage: Number(values.wage)
    }
    await fetch(`${URL}/trainers/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(object)
    });
    getData("trainers");
}

async function deleteDataItem(route, id){
    await fetch(`${URL}/${route}/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });
    getData(route);
}

getData("inventory");
getData("trainers");