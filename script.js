/* ============================================================
   STAYHANCE
   NYC AIRBNB ROOM TYPE PREDICTOR
   ============================================================ */


/* ============================================================
   01. API CONFIGURATION
   ============================================================ */

const API_BASE_URL =
  "https://stayhance-room-type-predictor.onrender.com";

const PREDICT_URL = `${API_BASE_URL}/predict`;

const HEALTH_URL = `${API_BASE_URL}/`;

/* ============================================================
   02. ROOM TYPE CONFIGURATION
   ============================================================ */

const ROOM_TYPES = {

  "Entire home/apt": {

    name: "Entire home / apt",

    shortName: "Entire home",

    icon: "house",

    color: "pink",

    description:
      "This listing looks most like an entire home or apartment based on the details you provided."

  },

  "Private room": {

    name: "Private room",

    shortName: "Private room",

    icon: "bed-double",

    color: "purple",

    description:
      "This listing looks most like a private room based on the details you provided."

  },

  "Shared room": {

    name: "Shared room",

    shortName: "Shared room",

    icon: "users",

    color: "blue",

    description:
      "This listing looks most like a shared room based on the details you provided."

  }

};


/* ============================================================
   03. EXAMPLE LISTINGS
   ============================================================ */

const EXAMPLES = [

  {

    latitude: 40.7128,

    longitude: -74.0060,

    neighbourhood_group: "Manhattan",

    neighbourhood: "Midtown",

    price: 150,

    minimum_nights: 3,

    availability_365: 180,

    number_of_reviews: 24,

    reviews_per_month: 1.2,

    calculated_host_listings_count: 1

  },


  {

    latitude: 40.6782,

    longitude: -73.9442,

    neighbourhood_group: "Brooklyn",

    neighbourhood: "Williamsburg",

    price: 95,

    minimum_nights: 2,

    availability_365: 250,

    number_of_reviews: 84,

    reviews_per_month: 2.8,

    calculated_host_listings_count: 2

  },


  {

    latitude: 40.7282,

    longitude: -73.7949,

    neighbourhood_group: "Queens",

    neighbourhood: "Flushing",

    price: 70,

    minimum_nights: 1,

    availability_365: 310,

    number_of_reviews: 130,

    reviews_per_month: 3.1,

    calculated_host_listings_count: 3

  }

];

let currentExample = 0;


/* ============================================================
   04. DOM ELEMENTS
   ============================================================ */

const form =
  document.getElementById(
    "predictForm"
  );

const predictBtn =
  document.getElementById(
    "predictBtn"
  );

const exampleBtn =
  document.getElementById(
    "exampleBtn"
  );

const formError =
  document.getElementById(
    "formError"
  );

const availabilityInput =
  document.getElementById(
    "availability_365"
  );

const availabilityValue =
  document.getElementById(
    "availabilityValue"
  );

const resultEmpty =
  document.getElementById(
    "resultEmpty"
  );

const resultContent =
  document.getElementById(
    "resultContent"
  );

const predictedName =
  document.getElementById(
    "predictedName"
  );

const predictionDescription =
  document.getElementById(
    "predictionDescription"
  );

const predictionConfidence =
  document.getElementById(
    "predictionConfidence"
  );

const predictionTypeIcon =
  document.getElementById(
    "predictionTypeIcon"
  );

const probList =
  document.getElementById(
    "probList"
  );

const apiStatus =
  document.getElementById(
    "apiStatus"
  );

const themeButton =
  document.getElementById(
    "themeButton"
  );


/* ============================================================
   05. ICON REFRESH
   ============================================================ */

function refreshIcons() {

  if (
    window.lucide &&
    typeof lucide.createIcons === "function"
  ) {

    lucide.createIcons();

  }

}


/* ============================================================
   06. AVAILABILITY SLIDER
   ============================================================ */

function updateAvailability() {

  if (
    !availabilityInput ||
    !availabilityValue
  ) {

    return;

  }

  availabilityValue.textContent =
    availabilityInput.value;

}


if (availabilityInput) {

  availabilityInput.addEventListener(
    "input",
    updateAvailability
  );

}


/* ============================================================
   07. EXAMPLE LISTING
   ============================================================ */

function loadExample() {

  if (!form) {
    return;
  }


  const example =
    EXAMPLES[
      currentExample %
      EXAMPLES.length
    ];


  currentExample++;


  Object.entries(
    example
  ).forEach(
    ([name, value]) => {

      const input =
        form.elements[name];

      if (input) {

        input.value =
          value;

      }

    }
  );


  updateAvailability();

  clearError();


  /*
   * Button feedback.
   */

  if (exampleBtn) {

    exampleBtn.style.transform =
      "scale(0.96)";

    setTimeout(
      () => {

        exampleBtn.style.transform =
          "";

      },
      130
    );

  }

}


if (exampleBtn) {

  exampleBtn.addEventListener(
    "click",
    loadExample
  );

}


/* ============================================================
   08. ERROR HANDLING
   ============================================================ */

function clearError() {

  if (formError) {

    formError.textContent =
      "";

  }

}


function showError(
  message
) {

  if (!formError) {
    return;
  }

  formError.textContent =
    message;

}


/* ============================================================
   09. COLLECT FORM DATA
   ============================================================ */

function getFormData() {

  const data =
    new FormData(form);


  return {

    latitude:
      parseFloat(
        data.get("latitude")
      ),

    longitude:
      parseFloat(
        data.get("longitude")
      ),

    price:
      parseFloat(
        data.get("price")
      ),

    minimum_nights:
      parseInt(
        data.get(
          "minimum_nights"
        ),
        10
      ),

    number_of_reviews:
      parseInt(
        data.get(
          "number_of_reviews"
        ),
        10
      ),

    reviews_per_month:
      parseFloat(
        data.get(
          "reviews_per_month"
        )
      ),

    calculated_host_listings_count:
      parseInt(
        data.get(
          "calculated_host_listings_count"
        ),
        10
      ),

    availability_365:
      parseInt(
        data.get(
          "availability_365"
        ),
        10
      ),

    neighbourhood_group:
      data.get(
        "neighbourhood_group"
      ),

    neighbourhood:
      data.get(
        "neighbourhood"
      )

  };

}


/* ============================================================
   10. VALIDATE DATA
   ============================================================ */

function validateData(
  data
) {

  const numericFields = [

    "latitude",
    "longitude",
    "price",
    "minimum_nights",
    "number_of_reviews",
    "reviews_per_month",
    "calculated_host_listings_count",
    "availability_365"

  ];


  for (
    const field of numericFields
  ) {

    if (
      !Number.isFinite(
        data[field]
      )
    ) {

      return false;

    }

  }


  if (
    !data.neighbourhood_group ||
    !data.neighbourhood
  ) {

    return false;

  }


  return true;

}


/* ============================================================
   11. LOADING STATE
   ============================================================ */

function setLoading(
  loading
) {

  if (!predictBtn) {
    return;
  }


  predictBtn.disabled =
    loading;


  predictBtn.classList.toggle(
    "loading",
    loading
  );

}


/* ============================================================
   12. API ERROR FORMAT
   ============================================================ */

function getApiError(
  detail
) {

  if (
    Array.isArray(detail)
  ) {

    return detail
      .map(
        item =>
          item.msg ||
          "Invalid value"
      )
      .join(", ");

  }


  if (
    typeof detail === "string"
  ) {

    return detail;

  }


  return "The prediction server returned an error.";

}


/* ============================================================
   13. SEND PREDICTION
   ============================================================ */

async function requestPrediction(
  payload
) {

  const response =
    await fetch(
      PREDICT_URL,
      {

        method:
          "POST",

        headers:
          {
            "Content-Type":
              "application/json"
          },

        body:
          JSON.stringify(
            payload
          )

      }
    );


  if (!response.ok) {

    let errorBody =
      null;


    try {

      errorBody =
        await response.json();

    }

    catch {

      /*
       * API did not return JSON.
       */

    }


    throw new Error(

      errorBody?.detail

        ? getApiError(
            errorBody.detail
          )

        : `Prediction failed (${response.status}).`

    );

  }


  return response.json();

}


/* ============================================================
   14. FORM SUBMISSION
   ============================================================ */

if (form) {

  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      clearError();


      /*
       * Browser validation.
       */

      if (
        !form.reportValidity()
      ) {

        return;

      }


      const payload =
        getFormData();


      if (
        !validateData(
          payload
        )
      ) {

        showError(
          "Please fill in all listing details correctly."
        );

        return;

      }


      setLoading(true);


      try {

        /*
         * Call FastAPI.
         */

        const result =
          await requestPrediction(
            payload
          );


        /*
         * Show prediction.
         */

        showPrediction(
          result
        );

      }


      catch (error) {

        console.error(
          "Stayhance prediction error:",
          error
        );


        const message =
          error?.message || "";


        if (
          message.includes(
            "Failed to fetch"
          )
        ) {

          showError(
            "The prediction server could not be reached. Please check that your FastAPI service is running."
          );

        }

        else {

          showError(
            message ||
            "Something went wrong while predicting the room type."
          );

        }

      }


      finally {

        setLoading(false);

      }

    }
  );

}


/* ============================================================
   15. NORMALIZE PROBABILITIES
   ============================================================ */

function normalizeProbabilities(
  probabilities
) {

  /*
   * Expected FastAPI response:
   *
   * Probability: [
   *   0.15,
   *   0.63,
   *   0.22
   * ]
   */


  if (
    !Array.isArray(
      probabilities
    )
  ) {

    return {

      "Entire home/apt": 0,

      "Private room": 0,

      "Shared room": 0

    };

  }


  return {

    "Entire home/apt":
      Number(
        probabilities[0]
      ) || 0,

    "Private room":
      Number(
        probabilities[1]
      ) || 0,

    "Shared room":
      Number(
        probabilities[2]
      ) || 0

  };

}


/* ============================================================
   16. FIND CONFIDENCE
   ============================================================ */

function getConfidence(
  probabilities,
  predicted
) {

  const value =
    probabilities[
      predicted
    ];


  if (
    typeof value !== "number"
  ) {

    return 0;

  }


  return Math.round(
    value * 100
  );

}


/* ============================================================
   17. SHOW PREDICTION
   ============================================================ */

function showPrediction(
  result
) {

  /*
   * FastAPI returns:
   *
   * {
   *   "Predicted_room_type": "Private room",
   *   "Probability": [...]
   * }
   */


  const predicted =
    result?.Predicted_room_type;


  if (!predicted) {

    throw new Error(
      "The API response did not contain a predicted room type."
    );

  }


  const room =
    ROOM_TYPES[predicted];


  if (!room) {

    throw new Error(
      `Unknown room type returned by API: ${predicted}`
    );

  }


  const probabilities =
    normalizeProbabilities(
      result?.Probability
    );


  const confidence =
    getConfidence(
      probabilities,
      predicted
    );


  /*
   * ================================================
   * IMPORTANT:
   * Remove waiting state completely.
   * Show result in its place.
   * ================================================
   */

  if (resultEmpty) {

    resultEmpty.hidden =
      true;

  }


  if (resultContent) {

    resultContent.hidden =
      false;

  }


  /*
   * Prediction name.
   */

  if (predictedName) {

    predictedName.textContent =
      room.name;

  }


  /*
   * Description.
   */

  if (
    predictionDescription
  ) {

    predictionDescription.textContent =
      room.description;

  }


  /*
   * Confidence.
   */

  if (
    predictionConfidence
  ) {

    animateNumber(
      predictionConfidence,
      confidence
    );

  }


  /*
   * Prediction icon.
   */

  if (
    predictionTypeIcon
  ) {

    predictionTypeIcon.setAttribute(
      "data-lucide",
      room.icon
    );

  }


  /*
   * Apply room color.
   */

  if (
    resultContent
  ) {

    resultContent.dataset.roomType =
      room.color;

  }


  /*
   * Probability bars.
   */

  renderProbabilities(
    probabilities,
    predicted
  );


  /*
   * Re-create icons.
   */

  refreshIcons();


  /*
   * Small result animation.
   */

  if (
    resultContent
  ) {

    resultContent.classList.remove(
      "result-refresh"
    );


    void resultContent.offsetWidth;


    resultContent.classList.add(
      "result-refresh"
    );

  }


  /*
   * Mobile:
   * bring result into view.
   */

  if (
    window.innerWidth <= 700 &&
    resultContent
  ) {

    setTimeout(
      () => {

        resultContent.scrollIntoView({

          behavior:
            "smooth",

          block:
            "start"

        });

      },
      120
    );

  }

}


/* ============================================================
   18. ANIMATE NUMBER
   ============================================================ */

function animateNumber(
  element,
  target
) {

  const duration =
    800;

  const startTime =
    performance.now();


  function update(
    currentTime
  ) {

    const elapsed =
      currentTime -
      startTime;


    const progress =
      Math.min(
        elapsed / duration,
        1
      );


    /*
     * Smooth ease-out.
     */

    const eased =
      1 -
      Math.pow(
        1 - progress,
        3
      );


    const current =
      Math.round(
        target * eased
      );


    element.textContent =
      `${current}%`;


    if (
      progress < 1
    ) {

      requestAnimationFrame(
        update
      );

    }

  }


  requestAnimationFrame(
    update
  );

}


/* ============================================================
   19. RENDER PROBABILITIES
   ============================================================ */

function renderProbabilities(
  probabilities,
  predicted
) {

  if (!probList) {
    return;
  }


  probList.innerHTML =
    "";


  /*
   * Keep a beautiful fixed order.
   */

  const order = [

    "Private room",

    "Shared room",

    "Entire home/apt"

  ];


  order.forEach(
    (roomType, index) => {

      const room =
        ROOM_TYPES[roomType];


      const probability =
        probabilities[
          roomType
        ] || 0;


      const percentage =
        Math.round(
          probability * 100
        );


      /*
       * Row
       */

      const row =
        document.createElement(
          "div"
        );


      row.className =
        "prob-row";


      if (
        roomType === predicted
      ) {

        row.classList.add(
          "top"
        );

      }


      /*
       * Room name
       */

      const name =
        document.createElement(
          "span"
        );


      name.className =
        "name";


      name.textContent =
        room.shortName;


      /*
       * Bar container
       */

      const track =
        document.createElement(
          "div"
        );


      track.className =
        "prob-track";


      /*
       * Bar
       */

      const fill =
        document.createElement(
          "div"
        );


      fill.className =
        "prob-fill";


      track.appendChild(
        fill
      );


      /*
       * Percentage
       */

      const value =
        document.createElement(
          "span"
        );


      value.className =
        "value";


      value.textContent =
        "0%";


      /*
       * Put everything together.
       */

      row.appendChild(
        name
      );

      row.appendChild(
        track
      );

      row.appendChild(
        value
      );


      probList.appendChild(
        row
      );


      /*
       * Animate bar.
       */

      setTimeout(
        () => {

          fill.style.width =
            `${percentage}%`;


          animateNumber(
            value,
            percentage
          );

        },

        120 +
        index * 130
      );

    }
  );

}


/* ============================================================
   20. API HEALTH CHECK
   ============================================================ */

async function checkApiStatus() {

  if (!apiStatus) {
    return;
  }


  const statusText =
    apiStatus.querySelector(
      ".status-text"
    );


  try {

    const response =
      await fetch(
        HEALTH_URL,
        {

          method:
            "GET",

          cache:
            "no-store"

        }
      );


    if (!response.ok) {

      throw new Error(
        "API unavailable"
      );

    }


    /*
     * Connected.
     */

    apiStatus.classList.remove(
      "api-status-offline"
    );


    if (statusText) {

      statusText.textContent =
        "API Connected";

    }

  }


  catch (error) {

    console.warn(
      "Stayhance API:",
      error
    );


    apiStatus.classList.add(
      "api-status-offline"
    );


    if (statusText) {

      statusText.textContent =
        "API Offline";

    }

  }

}


/* ============================================================
   21. THEME BUTTON
   ============================================================ */

let softMode =
  localStorage.getItem(
    "stayhance-theme"
  ) === "soft";


function updateTheme() {

  document.body.classList.toggle(
    "soft-mode",
    softMode
  );


  if (!themeButton) {
    return;
  }


  const icon =
    themeButton.querySelector(
      "svg"
    );


  /*
   * Change Lucide icon.
   */

  if (softMode) {

    themeButton.innerHTML =
      '<i data-lucide="sun"></i>';

  }

  else {

    themeButton.innerHTML =
      '<i data-lucide="moon"></i>';

  }


  refreshIcons();

}


if (themeButton) {

  themeButton.addEventListener(
    "click",
    () => {

      softMode =
        !softMode;


      localStorage.setItem(
        "stayhance-theme",
        softMode
          ? "soft"
          : "normal"
      );


      updateTheme();

    }
  );

}


/* ============================================================
   22. KEYBOARD SHORTCUT
   ============================================================ */

document.addEventListener(
  "keydown",
  event => {

    /*
     * Ctrl + Enter
     * or Cmd + Enter
     */

    if (

      (event.ctrlKey ||
       event.metaKey) &&

      event.key === "Enter"

    ) {

      event.preventDefault();


      if (
        form &&
        !predictBtn.disabled
      ) {

        form.requestSubmit();

      }

    }

  }
);


/* ============================================================
   23. INPUT INTERACTIONS
   ============================================================ */

function setupInputEffects() {

  if (!form) {
    return;
  }


  const inputs =
    form.querySelectorAll(
      "input, select"
    );


  inputs.forEach(
    input => {

      input.addEventListener(
        "input",
        () => {

          clearError();

        }
      );


      input.addEventListener(
        "change",
        () => {

          clearError();

        }
      );

    }
  );

}


/* ============================================================
   24. INITIALIZATION
   ============================================================ */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /*
     * Initial slider.
     */

    updateAvailability();


    /*
     * Icons.
     */

    refreshIcons();


    /*
     * Inputs.
     */

    setupInputEffects();


    /*
     * Restore theme.
     */

    updateTheme();


    /*
     * Check FastAPI.
     */

    checkApiStatus();

  }
);


/* ============================================================
   25. PERIODIC API CHECK
   ============================================================ */

setInterval(
  () => {

    checkApiStatus();

  },
  60000
);


/* ============================================================
   26. DEBUG ACCESS
   ============================================================ */

window.Stayhance = {

  predict:
    requestPrediction,

  loadExample,

  checkApiStatus,

  roomTypes:
    ROOM_TYPES

};