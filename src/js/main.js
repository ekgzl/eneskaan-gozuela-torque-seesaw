const plank = document.getElementById("plank");
const log = document.getElementById("log");
const leftWeightDisplay = document.getElementById("left-weight");
const rightWeightDisplay = document.getElementById("right-weight");
const angleDisplay = document.getElementById("angle");
const nextWeightDisplay = document.getElementById("next-weight");
const insideScreen = document.getElementById("inside-screen");

//querycSelector -> class

nextWeightDisplay.innerHTML = generateRandomWeight();

let objects = [];
let rightTorque = 0;
let leftTorque = 0;

function addWeightToSide(side, weight) {
  if (side === "right") {
    rightWeightDisplay.innerHTML =
      parseInt(rightWeightDisplay.textContent) + weight;
  } else {
    leftWeightDisplay.innerHTML =
      parseInt(leftWeightDisplay.textContent) + weight;
  }
}

function addTorqueToSide(side, weight, distance) {
  if (side === "right") {
    rightTorque += calculateTorque(distance, weight);
  } else {
    leftTorque += calculateTorque(distance, weight);
  }
}

function generateRandomWeight() {
  return Math.floor(Math.random() * 10) + 1;
}

function handleClick(side, distance) {
  const weight = parseInt(nextWeightDisplay.textContent);
  objects.push({
    weight,
    side,
    distance,
  });
  addWeightToSide(side, weight);
  addTorqueToSide(side, weight, distance);
  let randomWeight = generateRandomWeight();
  nextWeightDisplay.innerHTML = randomWeight;
}

function calculateTorque(distance, weight) {
  return distance * weight * 9.8;
}

function createElement(distance) {
  const newElement = document.createElement("img");
  newElement.src = "../../public/balon.png";
  newElement.style.position = "absolute";

  const plankHeight = plank.offsetLeft;
  const plankTop = plank.offsetTop;

  newElement.style.width = "32px";
  newElement.style.height = "32px";
  newElement.style.top = `${plankTop - parseInt(newElement.style.height)}px`;
  newElement.style.left = `${
    plankHeight + distance - parseInt(newElement.style.height) / 2
  }px`;

  insideScreen.appendChild(newElement);
}

function calculateAngle() {
  return Math.max(-30, Math.min(30, (rightTorque - leftTorque) / 10));
}

insideScreen.addEventListener("click", function (event) {
  // event.offsetX div'in sol kenarına uzaklığı piksel olarak veriyor
  // this.offsetWidth div'in toplam genişliğini veriyor
  const centerPoint = this.offsetWidth / 2;
  const distance = event.offsetX;

  if (distance < centerPoint) {
    const realDistance = (centerPoint - distance) / 50;
    handleClick("left", realDistance);
  } else {
    const realDistance = (distance - centerPoint) / 50;
    handleClick("right", realDistance);
  }
  createElement(distance);
  angleDisplay.innerHTML = calculateAngle().toFixed(2);
  plank.style.transform = `rotate(${parseInt(angleDisplay.textContent)}deg)`;
});
