const BACKEND_BASE_URL = "http://localhost:5177";

// REDIRECT_URI cần trùng khớp với URL được cấu hình trong Google API Console
const REDIRECT_URI = "http://127.0.0.1:5500/src/FE/google-response";

document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("loginButton");

  if (loginButton) {
    loginButton.addEventListener("click", () => {
      console.log("Chuyển hướng tới Google để đăng nhập...");
      window.location.href = `${BACKEND_BASE_URL}/api/auth/signin-google`;
    });
  }

  // Gọi hàm này để lấy JWT sau khi backend chuyển hướng lại trang frontend
  handleGoogleResponse();
});

async function handleGoogleResponse() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) {
      return; // Không có mã xác thực, thoát khỏi hàm
    }

    // Gửi yêu cầu đến backend để lấy JWT token
    const response = await fetch(`${BACKEND_BASE_URL}/api/auth/google-response?code=${code}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Phản hồi không thành công từ backend. Mã trạng thái: ${response.status}`);
      return;
    }

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("jwtToken", data.token);
      console.log("Đăng nhập thành công! Token:", data.token);
      window.location.href = "/index.html";
    } else {
      console.error("Không nhận được token từ backend.");
    }
  } catch (error) {
    console.error("Lỗi khi xử lý phản hồi từ Google:", error);
  }
}