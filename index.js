import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

// Set EJS as the templating engine
app.set("view engine", "ejs");

// HINTs: Use the axios documentation as well as the video lesson to help you.
// https://axios-http.com/docs/post_example
// Use the Secrets API documentation to figure out what each route expects and how to work with it.
// https://secrets-api.appbrewery.com/

//TODO 1: Add your own bearer token from the previous lesson.
const yourBearerToken = "ce7ef750-bda7-43e6-971c-90cef4696865";
const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
};

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
});

app.post("/get-secret", async (req, res) => {
  const searchId = req.body.id;
  console.log("searchId = ", searchId);
  try {
    const result = await axios.get(API_URL + "/secrets/" + searchId, config);
    console.log("result = ", result);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response.data) });
  }
});

app.post("/post-secret", async (req, res) => {
  // Throw error if the secret or score values are empty; these are MANDATORY fields to create a secret
  if (
    req.body.secret.trim().length === 0 ||
    req.body.score.trim().length === 0
  ) {
    res.render("index", {
      content: `Please add a secret AND a score`,
    });
  } else {
    // TODO 2: Use axios to POST the data from req.body to the secrets api servers.
    console.log("req.body = ", req.body);
    try {
      const createdSecret = await axios.post(
        `${API_URL}/secrets`,
        {
          // create a new secret with the input from the request
          secret: req.body.secret,
          score: req.body.score,
        },
        // Must have a bearer token in the header of the request in
        // order to send a post request to create a secret with this API
        config
      );
      const result = createdSecret.data;
      console.log("createdSecret.data = ", result);
      // Use JSON.stringify to turn the JS object from axios into a string.
      let resString = JSON.stringify(result);
      // send the string of the created secret to the EJS file
      res.render("index", {
        content: resString,
      });
    } catch (error) {
      console.log("Error: ", error);
      res.render("index", {
        content: error.message,
      });
    }
  }
});

app.post("/put-secret", async (req, res) => {
  const searchId = req.body.id;
  // Throw error if the secret or score values are empty; should not be able to replace an existing secret with empty values
  if (
    req.body.secret.trim().length === 0 ||
    req.body.score.trim().length === 0
  ) {
    res.render("index", {
      content: `Please add a secret AND a score so the secret with id = ${searchId} can be replaced.`,
    });
  } else {
    // TODO 3: Use axios to PUT the data from req.body to the secrets api servers.
    try {
      // retrieve the secret with id = searchId
      const result = await axios.put(
        API_URL + "/secrets/" + searchId,
        {
          // update its contents with the following
          secret: req.body.secret,
          score: req.body.score,
        },
        config
      );

      const replacedSecret = result.data;
      console.log("replacedSecret = ", replacedSecret);
      // Use JSON.stringify to turn the JS object from axios into a string.
      let resString = JSON.stringify(replacedSecret);

      // send the string of the updated secret to the EJS file
      res.render("index", {
        content: resString,
      });
    } catch (error) {
      console.log("Error: ", error.response.data);

      // Use JSON.stringify to turn the JS object from axios into a string.
      let errString = JSON.stringify(error.response.data);

      res.render("index", {
        content: errString,
      });
    }
  }
});

app.post("/patch-secret", async (req, res) => {
  const searchId = req.body.id;

  // Throw error if the secret AND score values are both empty; No point in
  // calling the patch method if you have nothing to update
  if (
    req.body.secret.trim().length === 0 &&
    req.body.score.trim().length === 0
  ) {
    res.render("index", {
      content: `Please add a secret OR a score so the secret with id = ${searchId} can be updated.`,
    });
  } else {
    // TODO 4: Use axios to PATCH the data from req.body to the secrets api servers.

    let body = {};
    // only include secret in the body of the request if it is not empty
    if (req.body.secret.trim().length > 0) {
      body.secret = req.body.secret;
    }
    // only include score in the body of the request if it is not empty
    if (req.body.score.trim().length > 0) {
      body.score = req.body.score;
    }

    console.log("body = ", body);
    try {
      const result = await axios.patch(
        API_URL + "/secrets/" + searchId,
        // update its contents with the following
        body,
        config
      );

      const updatedSecret = result.data;

      console.log("updatedSecret = ", updatedSecret);
      // Use JSON.stringify to turn the JS object from axios into a string.
      let resString = JSON.stringify(updatedSecret);

      // send the string of the updated secret to the EJS file
      res.render("index", {
        content: resString,
      });
    } catch (error) {
      console.log("Error: ", error.response.data);

      // Use JSON.stringify to turn the JS object from axios into a string.
      let errString = JSON.stringify(error.response.data);

      res.render("index", {
        content: errString,
      });
    }
  }
});

app.post("/delete-secret", async (req, res) => {
  const searchId = req.body.id;
  // TODO 5: Use axios to DELETE the item with searchId from the secrets api servers.
  try {
    let result = await axios.delete(API_URL + "/secrets/" + searchId, config);
    let deletedSecret = result.data;

    console.log("deletedSecret = ", deletedSecret);
    // Use JSON.stringify to turn the JS object from axios into a string.
    let resString = JSON.stringify(deletedSecret);

    // send the string of the message about the deleted secret to the EJS file
    res.render("index", {
      content: resString,
    });
  } catch (error) {
    console.log("Error: ", error.response.data);

    // Use JSON.stringify to turn the JS object from axios into a string.
    let errString = JSON.stringify(error.response.data);

    res.render("index", {
      content: errString,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
