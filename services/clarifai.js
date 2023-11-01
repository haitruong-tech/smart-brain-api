const calculateFaceBoundingBox = async (image_url) => {
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // In this section, we set the user authentication, user and app ID, model details, and the URL
  // of the image we want as an input. Change these strings to run your own example.
  //////////////////////////////////////////////////////////////////////////////////////////////////

  // TODO: migrate to server so we can protect the secret keys
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const { PAT, USER_ID, APP_ID, MODEL_ID } = process.env;

  ///////////////////////////////////////////////////////////////////////////////////
  // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
  ///////////////////////////////////////////////////////////////////////////////////

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: image_url,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
  // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
  // this will default to the latest version_id

  try {
    const response = await fetch(
      "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs",
      requestOptions
    );
    const result = await response.json();
    return (
      result?.outputs?.[0]?.data?.regions
        ?.map((region) => region?.region_info?.bounding_box)
        .filter(Boolean) ?? null
    );
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

module.exports = { calculateFaceBoundingBox };
