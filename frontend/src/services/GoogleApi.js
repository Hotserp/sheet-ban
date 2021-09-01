import axios from "axios";

export const getUserInfo = async (token) => {
  const userInfo = await axios.get(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return userInfo.data;
};

class GoogleAuth {
  auth2 = null;
  loadingPromise = null;

  #onGapiLoadPromise = (params) => {
    return new Promise((resolve, reject) => {
      window.onGapiLoad = () => {
        window.gapi.load("auth2", () => {
          try {
            this.auth2 = window.gapi.auth2.init(Object.assign({}, params));
          } catch (err) {
            reject({
              err:
                "client_id missing or is incorrect, or if you added extra params maybe they are written incorrectly",
            });
          }
          resolve(this.auth2);
        });
      };
    });
  };

  #wrapper = (f, method) => {
    if (f) return f[method]();
    else {
      const err = {
        err: "Script not loaded correctly",
      };
      return Promise.reject(err);
    }
  };

  #loadingAuth2 = (params) => {
    if (this.auth2) {
      return Promise.resolve(this.auth2);
    } else {
      if (!this.loadingPromise)
        this.loadingPromise = this.#onGapiLoadPromise(params);
      return this.loadingPromise;
    }
  };

  #createScript = () => {
    return new Promise((resolve) => {
      const el = document.getElementById("auth2_script_id");
      if (!el) {
        let gplatformScript = document.createElement("script");
        gplatformScript.setAttribute(
          "src",
          "https://apis.google.com/js/platform.js?onload=onGapiLoad"
        );
        gplatformScript.setAttribute("async", true);
        gplatformScript.setAttribute("defer", "defer");
        gplatformScript.setAttribute("id", "auth2_script_id");
        document.head.appendChild(gplatformScript);
      }
      resolve();
    });
  };

  #createMetaTag = ({ client_id }) => {
    const meta = document.createElement("meta");
    meta.name = "google-signin-client_id";
    meta.content = client_id;
    document.getElementsByTagName("head")[0].appendChild(meta);
  };

  signIn = () => this.#wrapper(this.auth2, "signIn");

  signOut = () => this.#wrapper(this.auth2, "signOut");

  isSignedIn = () => this.#wrapper(this.auth2.isSignedIn, "get");

  currentUser = () => this.#wrapper(this.auth2.currentUser, "get");

  grantOfflineAccess = () => this.#wrapper(this.auth2, "grantOfflineAccess");

  load = (params) => {
    this.#createMetaTag(params);

    return Promise.all([this.#loadingAuth2(params), this.#createScript()]).then(
      (results) => {
        return results[0];
      }
    );
  };

  mountButton = (id, params) => {
    window.gapi.signin2.render(id, params);
  };
}

export default new GoogleAuth();
