import { DOMElements } from "./domElements.js";

DOMElements.nextWeightDisplay.innerHTML = generateRandomWeight();
updateNextWeightIcon(DOMElements.nextWeightDisplay.textContent);
let objects = [];
let rightTorque = 0;
let leftTorque = 0;
let isHistoryCardVisible = false;
let ghostElement = null;
function pushInLog(message) {
  const newLogEntry = document.createElement("li");
  newLogEntry.innerHTML = message;
  DOMElements.historyListUl.appendChild(newLogEntry);
}

function pushInArray(droppedObject) {
  objects.push(droppedObject);
}

function createHistoryMessage(droppedObject) {
  const message = `${droppedObject.weight}kg dropped on ${
    droppedObject.side
  } side of seesaw. It is ${(droppedObject.distance * 50).toFixed(
    1
  )}px far away from the center of seesaw`;
  return message;
}

function addWeightToSide(droppedObject) {
  if (droppedObject.side === "right") {
    DOMElements.rightWeightDisplay.innerHTML =
      parseInt(DOMElements.rightWeightDisplay.textContent) +
      droppedObject.weight;
  } else {
    DOMElements.leftWeightDisplay.innerHTML =
      parseInt(DOMElements.leftWeightDisplay.textContent) +
      droppedObject.weight;
  }
}

function addTorqueToSide(droppedObject) {
  if (droppedObject.side === "right") {
    rightTorque += calculateTorque(droppedObject);
  } else {
    leftTorque += calculateTorque(droppedObject);
  }
}

function generateRandomWeight() {
  return Math.floor(Math.random() * 10) + 1;
}

function handleClick(droppedObject) {
  pushInArray(droppedObject);
  addWeightToSide(droppedObject);
  addTorqueToSide(droppedObject);
  pushInLog(createHistoryMessage(droppedObject));
  let randomWeight = generateRandomWeight();
  DOMElements.nextWeightDisplay.innerHTML = randomWeight;
  updateNextWeightIcon(randomWeight);
  saveToLocalStorage();
}

function calculateTorque(droppedObject) {
  return droppedObject.distance * droppedObject.weight;
}

function createDroppedElement(droppedObject) {
  const newDroppedElement = document.createElement("img");
  newDroppedElement.src = `../../public/weights/weight-${droppedObject.weight}kg.png`;
  newDroppedElement.style.position = "absolute";
  newDroppedElement.classList.add("falling-element");

  const plankOffsetLeft = DOMElements.plank.offsetLeft;

  if (droppedObject.weight === 8) {
    newDroppedElement.style.height = "128px";
  } else {
    newDroppedElement.style.width = "48px";
    newDroppedElement.style.height = "48px";
  }
  if (droppedObject.weight === 8) {
    newDroppedElement.style.top = `-25px`;
  } else {
    newDroppedElement.style.top = `40px`;
  }
  newDroppedElement.style.left = `${
    plankOffsetLeft +
    droppedObject.distance -
    parseInt(newDroppedElement.style.height) / 2
  }px`;

  DOMElements.plankBox.appendChild(newDroppedElement);
}

function calculateAngle() {
  return Math.max(-30, Math.min(30, rightTorque - leftTorque));
}

DOMElements.insideScreen.addEventListener("click", function (event) {
  // event.offsetX div'in sol kenarına uzaklığı piksel olarak veriyor
  // this.offsetWidth div'in toplam genişliğini veriyor
  const centerPoint = this.offsetWidth / 2;
  const distance = event.offsetX;
  const weight = parseInt(DOMElements.nextWeightDisplay.textContent);
  const dropSound = document.getElementById("drop-sound");
  if (dropSound) {
    dropSound.currentTime = 0;
    dropSound.play();
  }
  if (distance < centerPoint) {
    const realDistance = (centerPoint - distance) / 50;
    const droppedObject = {
      weight: weight,
      side: "left",
      distance: realDistance,
    };
    handleClick(droppedObject);
  } else {
    const realDistance = (distance - centerPoint) / 50;
    const droppedObject = {
      weight: weight,
      side: "right",
      distance: realDistance,
    };
    handleClick(droppedObject);
  }
  createDroppedElement({
    distance: distance,
    weight: weight,
  });
  DOMElements.angleDisplay.innerHTML = calculateAngle().toFixed(1);
  DOMElements.plankBox.style.transform = `rotate(${parseInt(
    DOMElements.angleDisplay.textContent
  )}deg)`;
  if (ghostElement) {
    ghostElement.remove();
    ghostElement = null;
  }

  createGhostElement(event);

  DOMElements.plankBox.appendChild(ghostElement);
});

function handleIsHistoryCardVisible() {
  if (isHistoryCardVisible) {
    DOMElements.historyCard.style.visibility = "hidden";
    isHistoryCardVisible = false;
  } else {
    DOMElements.historyCard.style.visibility = "visible";
    isHistoryCardVisible = true;
  }
}

function resetSimulation() {
  objects = [];
  rightTorque = 0;
  leftTorque = 0;
  DOMElements.leftWeightDisplay.innerHTML = "0";
  DOMElements.rightWeightDisplay.innerHTML = "0";
  DOMElements.angleDisplay.innerHTML = "0";
  DOMElements.plankBox.style.transform = "rotate(0deg)";
  DOMElements.historyListUl.innerHTML = "";
  const droppedWeights = DOMElements.insideScreen.querySelectorAll("img");
  droppedWeights.forEach((weight) => {
    if (weight.id === "plank" || weight.id === "pivot") {
      return;
    }
    weight.remove();
  });
  DOMElements.nextWeightDisplay.innerHTML = generateRandomWeight();
  updateNextWeightIcon(DOMElements.nextWeightDisplay.textContent);
  localStorage.removeItem("seesaw");
}

function saveToLocalStorage() {
  const simulationData = {
    objects: objects,
    rightTorque: rightTorque,
    leftTorque: leftTorque,
    nextWeight: parseInt(DOMElements.nextWeightDisplay.textContent),
    historyLog: DOMElements.historyListUl.innerHTML,
  };
  localStorage.setItem("seesaw", JSON.stringify(simulationData));
}

function loadFromLocalStorage() {
  const savedData = localStorage.getItem("seesaw");
  if (savedData) {
    const simulationData = JSON.parse(savedData);

    objects = simulationData.objects;
    rightTorque = simulationData.rightTorque;
    leftTorque = simulationData.leftTorque;

    let totalLeftWeight = 0;
    let totalRightWeight = 0;

    objects.forEach((obj) => {
      if (obj.side === "left") {
        totalLeftWeight += obj.weight;
      } else {
        totalRightWeight += obj.weight;
      }
    });

    DOMElements.leftWeightDisplay.innerHTML = totalLeftWeight;
    DOMElements.rightWeightDisplay.innerHTML = totalRightWeight;
    DOMElements.nextWeightDisplay.innerHTML = simulationData.nextWeight;
    updateNextWeightIcon(simulationData.nextWeight);
    DOMElements.historyListUl.innerHTML = simulationData.historyLog;

    objects.forEach((obj) => {
      const centerPoint = DOMElements.insideScreen.offsetWidth / 2;
      const distance =
        obj.side === "left"
          ? centerPoint - obj.distance * 50
          : centerPoint + obj.distance * 50;

      createDroppedElement({
        distance: distance,
        weight: obj.weight,
      });
    });

    DOMElements.angleDisplay.innerHTML = calculateAngle().toFixed(1);
    DOMElements.plankBox.style.transform = `rotate(${parseInt(
      DOMElements.angleDisplay.textContent
    )}deg)`;
  }
}

DOMElements.insideScreen.addEventListener("mouseenter", function (event) {
  if (ghostElement) return;

  createGhostElement(event);

  DOMElements.plankBox.appendChild(ghostElement);
});

DOMElements.insideScreen.addEventListener("mousemove", function (event) {
  if (!ghostElement) return;

  const plankOffsetLeft = DOMElements.plank.offsetLeft;
  const elementWidth = parseInt(ghostElement.style.width);

  ghostElement.style.left = `${
    plankOffsetLeft + event.offsetX - elementWidth / 2
  }px`;
});

DOMElements.insideScreen.addEventListener("mouseleave", function () {
  if (ghostElement) {
    ghostElement.remove();
    ghostElement = null;
  }
});

function createGhostElement(event) {
  const nextWeight = parseInt(DOMElements.nextWeightDisplay.textContent);
  ghostElement = document.createElement("img");
  ghostElement.src = `../../public/weights/weight-${nextWeight}kg.png`;
  ghostElement.style.position = "absolute";
  ghostElement.style.opacity = "0.5";
  ghostElement.style.pointerEvents = "none";
  if (nextWeight === 8) {
    ghostElement.style.height = "128px";
    ghostElement.style.top = `-25px`;
    ghostElement.style.width = "72px";
  } else {
    ghostElement.style.width = "48px";
    ghostElement.style.height = "48px";
    ghostElement.style.top = `40px`;
  }
  const plankOffsetLeft = DOMElements.plank.offsetLeft;
  const elementWidth = parseInt(ghostElement.style.width);
  ghostElement.style.left = `${
    plankOffsetLeft + event.offsetX - elementWidth / 2
  }px`;
}

function updateNextWeightIcon(weight) {
  const icon = document.getElementById("next-weight-icon");
  if (icon) {
    icon.src = `../../public/weights/weight-${weight}kg.png`;
  }
}

DOMElements.resetButton.addEventListener("click", resetSimulation);
DOMElements.historyButton.addEventListener("click", handleIsHistoryCardVisible);

loadFromLocalStorage();
