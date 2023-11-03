const calculateFaceBoundingBox = async (image_url) => {
  const { PAT, USER_ID, APP_ID, MODEL_ID } = process.env;

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
