// function to fetch JSON data
async function fetchData() {
  try {
    // fetch reference.json to get first data file name
    const referenceResponse = await fetch("data/reference.json");
    const referenceData = await referenceResponse.json();

    // fetch data1.json (names unknown, but obtained from reference.json)
    const data1Response = await fetch(`data/${referenceData.data_location}`);
    const data1 = await data1Response.json();

    // fetch data2.json (obtained from data1.json)
    const data2Response = await fetch(`data/${data1.data_location}`);
    const data2 = await data2Response.json();

    // fetch data3.json (known name)
    const data3Response = await fetch("data/data3.json");
    const data3 = await data3Response.json();

    // process and display all data
    const processedData1 = processData(data1.data);
    const processedData2 = processData(data2.data);
    const processedData3 = processData(data3.data);

    // stitch together data1, data2, and data3
    const allData = [...processedData1, ...processedData2, ...processedData3];

    // display data in table
    displayData(allData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// function to process each dataset and split names
function processData(data) {
  return data.map((student) => {
    const [name, surname] = student.name.split(" ");
    return { name, surname, id: student.id };
  });
}

// function to display data in table
function displayData(students) {
  const tableBody = document.querySelector("#student-table tbody");
  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${student.name}</td><td>${student.surname}</td><td>${student.id}</td>`;
    tableBody.appendChild(row);
  });
}

// start fetching data when page loads
fetchData();

// synchronous XMLHttpRequest implementation
function fetchDataSync() {
  try {
    // fetch reference.json synchronously
    const referenceRequest = new XMLHttpRequest();
    referenceRequest.open("GET", "data/reference.json", false);
    referenceRequest.send(null);
    const referenceData = JSON.parse(referenceRequest.responseText);

    // fetch data1.json synchronously
    const data1Request = new XMLHttpRequest();
    data1Request.open("GET", `data/${referenceData.data_location}`, false);
    data1Request.send(null);
    const data1 = JSON.parse(data1Request.responseText);

    // fetch data2.json synchronously
    const data2Request = new XMLHttpRequest();
    data2Request.open("GET", `data/${data1.data_location}`, false);
    data2Request.send(null);
    const data2 = JSON.parse(data2Request.responseText);

    // fetch data3.json synchronously
    const data3Request = new XMLHttpRequest();
    data3Request.open("GET", "data/data3.json", false);
    data3Request.send(null);
    const data3 = JSON.parse(data3Request.responseText);

    // process and display all data
    const processedData1 = processData(data1.data);
    const processedData2 = processData(data2.data);
    const processedData3 = processData(data3.data);

    const allData = [...processedData1, ...processedData2, ...processedData3];
    displayData(allData);
  } catch (error) {
    console.error("Error fetching data synchronously:", error);
  }
}

// asynchronous XMLHttpRequest with callbacks
function fetchDataAsyncWithCallbacks() {
  const referenceRequest = new XMLHttpRequest();
  referenceRequest.open("GET", "data/reference.json", true);

  referenceRequest.onload = function () {
    const referenceData = JSON.parse(referenceRequest.responseText);

    // fetch data1.json asynchronously
    const data1Request = new XMLHttpRequest();
    data1Request.open("GET", `data/${referenceData.data_location}`, true);

    data1Request.onload = function () {
      const data1 = JSON.parse(data1Request.responseText);

      // fetch data2.json asynchronously
      const data2Request = new XMLHttpRequest();
      data2Request.open("GET", `data/${data1.data_location}`, true);

      data2Request.onload = function () {
        const data2 = JSON.parse(data2Request.responseText);

        // fetch data3.json asynchronously
        const data3Request = new XMLHttpRequest();
        data3Request.open("GET", "data/data3.json", true);

        data3Request.onload = function () {
          const data3 = JSON.parse(data3Request.responseText);

          // process and display all data
          const processedData1 = processData(data1.data);
          const processedData2 = processData(data2.data);
          const processedData3 = processData(data3.data);

          const allData = [
            ...processedData1,
            ...processedData2,
            ...processedData3,
          ];
          // display combined data in table
          displayData(allData);
        };
        // send request to fetch data3.json
        data3Request.send();
      };
      // send request to fetch data2.json
      data2Request.send();
    };
    // send request to fetch data1.json
    data1Request.send();
  };
  // send request to fetch reference.json
  referenceRequest.send();
}

// fetch() and promises implementation
function fetchDataWithPromises() {
  // fetch reference.json using fetch API
  fetch("data/reference.json")
    // parse response as JSON and return promise
    .then((response) => response.json())
    .then((referenceData) => {
      // fetch data1.json using location from reference.json
      return fetch(`data/${referenceData.data_location}`);
    })
    // parse response as JSON and return promise
    .then((response) => response.json())
    .then((data1) => {
      return fetch(`data/${data1.data_location}`)
        .then((response) => response.json())
        .then((data2) => ({ data1, data2 }));
    })
    .then(({ data1, data2 }) => {
      return fetch("data/data3.json")
        .then((response) => response.json())
        .then((data3) => ({ data1, data2, data3 }));
    })
    .then(({ data1, data2, data3 }) => {
      // process data from all 3 files
      const processedData1 = processData(data1.data);
      const processedData2 = processData(data2.data);
      const processedData3 = processData(data3.data);

      const allData = [...processedData1, ...processedData2, ...processedData3];
      // display the data
      displayData(allData);
    })
    .catch((error) =>
      console.error("Error fetching data with promises:", error)
    );
}

// Attach event listeners to buttons
document.getElementById("sync-btn").addEventListener("click", fetchDataSync);
document
  .getElementById("async-callback-btn")
  .addEventListener("click", fetchDataAsyncWithCallbacks);
document
  .getElementById("promise-btn")
  .addEventListener("click", fetchDataWithPromises);
