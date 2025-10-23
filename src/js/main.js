const plank = document.getElementById("plank");
const log = document.getElementById("log");
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

function pushInArray(log) {
  objects.push(log);
}

function createHistoryMessage(log) {
  const message = `${log.weight}kg dropped on ${
    log.side
  } side of seesaw. It is ${(log.distance * 50).toFixed(
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
}

function calculateTorque(droppedObject) {
  return droppedObject.distance * droppedObject.weight * 9.8;
}

function createDroppedElement(droppedObject) {
  const newDroppedElement = document.createElement("img");
  newDroppedElement.src = `../../public/weights/weight-${droppedObject.weight}kg.png`;
  newDroppedElement.style.position = "absolute";

  const plankOffsetLeft = plank.offsetLeft;
  const plankOffsetTop = plank.offsetTop;

  newDroppedElement.style.width = "48px";
  newDroppedElement.style.height = "48px";
  newDroppedElement.style.top = `${plankOffsetTop - plank.height / 3}px`;
  newDroppedElement.style.left = `${
    plankOffsetLeft +
    droppedObject.distance -
    parseInt(newDroppedElement.style.height) / 2
  }px`;

  plankBox.appendChild(newDroppedElement);
}

function calculateAngle() {
  return Math.max(-30, Math.min(30, (rightTorque - leftTorque) / 10));
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
  console.log("sa");
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
    if (weight.id === "plank" || weight.id === "log") {
      return;
    }
    weight.remove();
  });
  nextWeightDisplay.innerHTML = generateRandomWeight();
}
