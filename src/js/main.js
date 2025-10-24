const plank = document.getElementById("plank");
const leftWeightDisplay = document.getElementById("left-weight");
const rightWeightDisplay = document.getElementById("right-weight");
const angleDisplay = document.getElementById("angle");
const nextWeightDisplay = document.getElementById("next-weight");
const insideScreen = document.getElementById("inside-screen");
const historyListUl = document.getElementById("history-card-list-ul");
const historyCard = document.getElementById("history-card");
const plankBox = document.getElementById("plank-box");
//querycSelector -> class
nextWeightDisplay.innerHTML = generateRandomWeight();

let objects = [];
let rightTorque = 0;
let leftTorque = 0;
let isHistoryCardVisible = false;

function pushInLog(message) {
  const newLogEntry = document.createElement("li");
  newLogEntry.innerHTML = message;
  historyListUl.appendChild(newLogEntry);
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
    rightWeightDisplay.innerHTML =
      parseInt(rightWeightDisplay.textContent) + droppedObject.weight;
  } else {
    leftWeightDisplay.innerHTML =
      parseInt(leftWeightDisplay.textContent) + droppedObject.weight;
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
  nextWeightDisplay.innerHTML = randomWeight;
  saveToLocalStorage();
}

function calculateTorque(droppedObject) {
  return droppedObject.distance * droppedObject.weight;
}

function createDroppedElement(droppedObject) {
  const newDroppedElement = document.createElement("img");
  newDroppedElement.src = `../../public/weights/weight-${droppedObject.weight}kg.png`;
  newDroppedElement.style.position = "absolute";

  const plankOffsetLeft = plank.offsetLeft;

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

  plankBox.appendChild(newDroppedElement);
}

function calculateAngle() {
  return Math.max(-30, Math.min(30, rightTorque - leftTorque));
}

insideScreen.addEventListener("click", function (event) {
  // event.offsetX div'in sol kenarına uzaklığı piksel olarak veriyor
  // this.offsetWidth div'in toplam genişliğini veriyor
  const centerPoint = this.offsetWidth / 2;
  const distance = event.offsetX;
  const weight = parseInt(nextWeightDisplay.textContent);

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
  angleDisplay.innerHTML = calculateAngle().toFixed(1);
  plankBox.style.transform = `rotate(${parseInt(angleDisplay.textContent)}deg)`;
});

function handleIsHistoryCardVisible() {
  if (isHistoryCardVisible) {
    historyCard.style.visibility = "hidden";
    isHistoryCardVisible = false;
  } else {
    historyCard.style.visibility = "visible";
    isHistoryCardVisible = true;
  }
}

function resetSimulation() {
  objects = [];
  rightTorque = 0;
  leftTorque = 0;
  leftWeightDisplay.innerHTML = "0";
  rightWeightDisplay.innerHTML = "0";
  angleDisplay.innerHTML = "0.0";
  plank.style.transform = "rotate(0deg)";
  historyListUl.innerHTML = "";
  const droppedWeights = insideScreen.querySelectorAll("img");
  droppedWeights.forEach((weight) => {
    if (weight.id === "plank" || weight.id === "pivot") {
      return;
    }
    weight.remove();
  });
  nextWeightDisplay.innerHTML = generateRandomWeight();
  localStorage.removeItem("seesaw");
}

function saveToLocalStorage() {
  const simulationData = {
    objects: objects,
    rightTorque: rightTorque,
    leftTorque: leftTorque,
    nextWeight: parseInt(nextWeightDisplay.textContent),
    historyLog: historyListUl.innerHTML,
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

    leftWeightDisplay.innerHTML = totalLeftWeight;
    rightWeightDisplay.innerHTML = totalRightWeight;
    nextWeightDisplay.innerHTML = simulationData.nextWeight;
    historyListUl.innerHTML = simulationData.historyLog;

    objects.forEach((obj) => {
      const centerPoint = insideScreen.offsetWidth / 2;
      const distance =
        obj.side === "left"
          ? centerPoint - obj.distance * 50
          : centerPoint + obj.distance * 50;

      createDroppedElement({
        distance: distance,
        weight: obj.weight,
      });
    });

    angleDisplay.innerHTML = calculateAngle().toFixed(1);
    plankBox.style.transform = `rotate(${parseInt(
      angleDisplay.textContent
    )}deg)`;
  }
}

loadFromLocalStorage();
