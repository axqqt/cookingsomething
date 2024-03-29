import Axios from "axios";

const BASE = "http://localhost:8000";

export async function AddImg(image) {
  try {
    const response = await Axios.post(`${BASE}/main/uploadimg`, { image });
    return response.data;
  } catch (err) {
    console.error(err);
  }
}

export const Login = async (data) => {
  try {
    const response = await Axios.post(`${BASE}/login`, data);
    if (response.status === 200) {
      const responseData = response.data;
      const { AccessToken, RefreshToken } = responseData;
      localStorage.setItem("accessToken", AccessToken);
      localStorage.setItem("refreshToken", RefreshToken);
      sessionStorage.setItem("user", data);
    }
  } catch (err) {
    console.log(err.message);
  }
};

export const Register = async (data) => {
  try {
    const response = await Axios.post(`${BASE}/register`, data);
    if (response.status === 200) {
      const responseData = response.data;
      const { AccessToken, RefreshToken } = responseData;
      localStorage.setItem("accessToken", AccessToken);
      localStorage.setItem("refreshToken", RefreshToken);
      sessionStorage.setItem("user", data);
    }
  } catch (err) {
    console.log(err.message);
  }
};

export async function GenerateTheStory(prompt) {
  try {
    const request = await Axios.post(`${BASE}/vids`, { theVids: prompt });
    if (request.status === 200) {
      return request.data;
    } else if (request.status === 404) {
      alert("error!");
    }
  } catch (err) {
    console.error(err);
  }
}

export async function GenerateStories(prompt) {
  try {
    const request = await Axios.post(`${BASE}/vids`, { theVids: prompt });
    if (request.status === 200) {
      return request.data;
    } else if (request.status === 404) {
      alert("error!");
    }
  } catch (err) {
    console.error(err);
  }
}

export async function CreatingVideo(searchVid) {
  try {
    const request = await Axios.post(`${BASE}/vids`, { theVideo: searchVid });
    if (request.status === 200) {
      return request.data;
    } else if (request.status === 404) {
      alert("No data found!");
    }
  } catch (err) {
    console.error(err);
  }
}

export async function CopyWrite(userData) {
  try {
    const response = await Axios.post(`${BASE}/main`, userData);

    if (response.status === 200) {
      return response.data;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function CreateThumbnail(prompt) {
  try {
    const { data } = await Axios.post(`${BASE}/main/images`, prompt);
    if (data.status === 200) {
      return data;
    }
  } catch (err) {
    console.error(err);
  }
}
