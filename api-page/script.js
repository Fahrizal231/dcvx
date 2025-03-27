document.addEventListener("DOMContentLoaded", async () => {
  const loadingScreen = document.getElementById("loadingScreen")
  const body = document.body
  body.classList.add("no-scroll")

  // Check for saved theme preference or use system preference
  const prefersDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  const savedTheme = localStorage.getItem("theme")

  if (savedTheme === "dark" || (!savedTheme && prefersDarkMode)) {
    document.body.classList.add("dark")
    document.getElementById("themeIcon").classList.replace("bi-sun-fill", "bi-moon-fill")
  }

  // Theme toggle functionality
  document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark")
    const isDark = document.body.classList.contains("dark")
    localStorage.setItem("theme", isDark ? "dark" : "light")

    const themeIcon = document.getElementById("themeIcon")
    if (isDark) {
      themeIcon.classList.replace("bi-sun-fill", "bi-moon-fill")
    } else {
      themeIcon.classList.replace("bi-moon-fill", "bi-sun-fill")
    }

    showToast(isDark ? "Dark mode enabled" : "Light mode enabled", "info")
  })

  try {
    const settings = await fetch("/src/settings.json").then((res) => res.json())

    const setContent = (id, property, value) => {
      const element = document.getElementById(id)
      if (element) element[property] = value
    }

    const randomImageSrc =
      Array.isArray(settings.header.imageSrc) && settings.header.imageSrc.length > 0
        ? settings.header.imageSrc[Math.floor(Math.random() * settings.header.imageSrc.length)]
        : ""

    const dynamicImage = document.getElementById("dynamicImage")
    if (dynamicImage) {
      dynamicImage.src = randomImageSrc

      const setImageSize = () => {
        const screenWidth = window.innerWidth
        if (screenWidth < 768) {
          dynamicImage.style.maxWidth = settings.header.imageSize.mobile || "100%"
        } else if (screenWidth < 1200) {
          dynamicImage.style.maxWidth = settings.header.imageSize.tablet || "50%"
        } else {
          dynamicImage.style.maxWidth = settings.header.imageSize.desktop || "40%"
        }
        dynamicImage.style.height = "auto"
      }

      setImageSize()
      window.addEventListener("resize", setImageSize)
    }

    setContent("page", "textContent", settings.name || "Rynn UI")
    setContent("header", "textContent", settings.name || "Rynn UI")
    setContent("name", "textContent", settings.name || "Rynn UI")
    setContent("version", "textContent", settings.version || "v1.0 Beta")
    setContent("versionHeader", "textContent", settings.header.status || "Online!")
    setContent("description", "textContent", settings.description || "Simple API's")

    const apiLinksContainer = document.getElementById("apiLinks")
    if (apiLinksContainer && settings.links?.length) {
      settings.links.forEach(({ url, name, icon }) => {
        const link = Object.assign(document.createElement("a"), {
          href: url,
          target: "_blank",
          className: "lead d-flex align-items-center",
        })

        const iconElement = document.createElement("i")
        iconElement.className = icon || "bi bi-link-45deg"
        iconElement.style.marginRight = "8px"

        const textElement = document.createElement("span")
        textElement.textContent = name

        link.appendChild(iconElement)
        link.appendChild(textElement)
        apiLinksContainer.appendChild(link)
      })
    }

    const apiContent = document.getElementById("apiContent")
    settings.categories.forEach((category) => {
      const sortedItems = category.items.sort((a, b) => a.name.localeCompare(b.name))
      const categoryContent = sortedItems
        .map((item, index, array) => {
          const isLastItem = index === array.length - 1
          const itemClass = `col-md-6 col-lg-4 api-item ${isLastItem ? "mb-4" : "mb-3"}`

          // Determine API method and color
          const method = item.method || "GET"
          const methodClass = method.toLowerCase()

          return `
              <div class="${itemClass}" data-name="${item.name}" data-desc="${item.desc}" data-tags="${item.tags || ""}">
                  <div class="hero-section d-flex align-items-center justify-content-between" style="height: 80px;">
                      <div>
                          <div class="d-flex align-items-center mb-1">
                              <span class="api-method ${methodClass}">${method}</span>
                              <h5 class="mb-0" style="font-size: 16px;">${item.name}</h5>
                          </div>
                          <p class="text-muted mb-0" style="font-size: 0.8rem;">${item.desc}</p>
                      </div>
                      <button class="btn btn-dark btn-sm get-api-btn" data-api-path="${item.path}" data-api-name="${item.name}" data-api-desc="${item.desc}" data-api-method="${method}">
                          Try it
                      </button>
                  </div>
              </div>
          `
        })
        .join("")
      apiContent.insertAdjacentHTML(
        "beforeend",
        `
                <div class="category-section mb-5 fade-in">
                    <h3 class="mb-4 category-header" style="font-size: 22px;">${category.name}</h3>
                    <div class="row">${categoryContent}</div>
                </div>
            `,
      )
    })

    const searchInput = document.getElementById("searchInput")
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase()
      const apiItems = document.querySelectorAll(".api-item")
      const categorySections = document.querySelectorAll(".category-section")

      apiItems.forEach((item) => {
        const name = item.getAttribute("data-name").toLowerCase()
        const desc = item.getAttribute("data-desc").toLowerCase()
        const tags = (item.getAttribute("data-tags") || "").toLowerCase()
        item.style.display =
          name.includes(searchTerm) || desc.includes(searchTerm) || tags.includes(searchTerm) ? "" : "none"
      })

      categorySections.forEach((section) => {
        const visibleItems = section.querySelectorAll('.api-item:not([style*="display: none"])')
        section.style.display = visibleItems.length ? "" : "none"
      })
    })

    // Copy functionality
    document.getElementById("copyEndpoint").addEventListener("click", () => {
      copyToClipboard(document.getElementById("apiEndpoint").textContent)
    })

    document.getElementById("copyResponse").addEventListener("click", () => {
      copyToClipboard(document.getElementById("apiResponseContent").textContent)
    })

    document.addEventListener("click", (event) => {
      if (!event.target.classList.contains("get-api-btn")) return

      const { apiPath, apiName, apiDesc, apiMethod } = event.target.dataset
      const modal = new bootstrap.Modal(document.getElementById("apiResponseModal"))
      const modalRefs = {
        label: document.getElementById("apiResponseModalLabel"),
        desc: document.getElementById("apiResponseModalDesc"),
        content: document.getElementById("apiResponseContent"),
        endpoint: document.getElementById("apiEndpoint"),
        spinner: document.getElementById("apiResponseLoading"),
        queryInputContainer: document.getElementById("apiQueryInputContainer"),
        submitBtn: document.getElementById("submitQueryBtn"),
        copyEndpoint: document.getElementById("copyEndpoint"),
        copyResponse: document.getElementById("copyResponse"),
      }

      modalRefs.label.textContent = apiName
      modalRefs.desc.textContent = apiDesc
      modalRefs.content.textContent = ""
      modalRefs.endpoint.textContent = ""
      modalRefs.spinner.classList.add("d-none")
      modalRefs.content.classList.add("d-none")
      modalRefs.endpoint.classList.add("d-none")
      modalRefs.copyEndpoint.classList.add("d-none")
      modalRefs.copyResponse.classList.add("d-none")

      modalRefs.queryInputContainer.innerHTML = ""
      modalRefs.submitBtn.classList.add("d-none")

      const baseApiUrl = `${window.location.origin}${apiPath}`
      const params = new URLSearchParams(apiPath.split("?")[1])
      const hasParams = params.toString().length > 0

      if (hasParams) {
        const paramContainer = document.createElement("div")
        paramContainer.className = "param-container"

        const paramsArray = Array.from(params.keys())

        paramsArray.forEach((param, index) => {
          const paramGroup = document.createElement("div")
          paramGroup.className = index < paramsArray.length - 1 ? "mb-3" : ""

          const label = document.createElement("label")
          label.className = "form-label"
          label.textContent = `${param}`

          const inputField = document.createElement("input")
          inputField.type = "text"
          inputField.className = "form-control"
          inputField.placeholder = `Enter ${param}...`
          inputField.dataset.param = param

          inputField.required = true
          inputField.addEventListener("input", validateInputs)

          paramGroup.appendChild(label)
          paramGroup.appendChild(inputField)
          paramContainer.appendChild(paramGroup)
        })

        const currentItem = settings.categories
          .flatMap((category) => category.items)
          .find((item) => item.path === apiPath)

        if (currentItem && currentItem.innerDesc) {
          const innerDescDiv = document.createElement("div")
          innerDescDiv.className = "text-muted mt-3 mb-3"
          innerDescDiv.style.fontSize = "13px"
          innerDescDiv.innerHTML = currentItem.innerDesc.replace(/\n/g, "<br>")
          paramContainer.appendChild(innerDescDiv)
        }

        modalRefs.queryInputContainer.appendChild(paramContainer)
        modalRefs.submitBtn.classList.remove("d-none")

        modalRefs.submitBtn.onclick = async () => {
          const inputs = modalRefs.queryInputContainer.querySelectorAll("input")
          const newParams = new URLSearchParams()
          let isValid = true

          inputs.forEach((input) => {
            if (!input.value.trim()) {
              isValid = false
              input.classList.add("is-invalid")
            } else {
              input.classList.remove("is-invalid")
              newParams.append(input.dataset.param, input.value.trim())
            }
          })

          if (!isValid) {
            showToast("Please fill in all required fields.", "error")
            return
          }

          const apiUrlWithParams = `${window.location.origin}${apiPath.split("?")[0]}?${newParams.toString()}`

          modalRefs.queryInputContainer.innerHTML = ""
          modalRefs.submitBtn.classList.add("d-none")
          handleApiRequest(apiUrlWithParams, modalRefs, apiName, apiMethod)
        }
      } else {
        handleApiRequest(baseApiUrl, modalRefs, apiName, apiMethod)
      }

      modal.show()
    })

    function validateInputs() {
      const submitBtn = document.getElementById("submitQueryBtn")
      const inputs = document.querySelectorAll(".param-container input")
      const isValid = Array.from(inputs).every((input) => input.value.trim() !== "")
      submitBtn.disabled = !isValid
    }

    async function handleApiRequest(apiUrl, modalRefs, apiName, method = "GET") {
      modalRefs.spinner.classList.remove("d-none")
      modalRefs.content.classList.add("d-none")
      modalRefs.copyResponse.classList.add("d-none")

      try {
        modalRefs.endpoint.textContent = `${method} ${apiUrl}`
        modalRefs.endpoint.classList.remove("d-none")
        modalRefs.copyEndpoint.classList.remove("d-none")

        const options = {
          method: method,
          headers: {
            Accept: "application/json, image/*",
          },
        }

        const response = await fetch(apiUrl, options)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const contentType = response.headers.get("Content-Type")
        if (contentType && contentType.startsWith("image/")) {
          const blob = await response.blob()
          const imageUrl = URL.createObjectURL(blob)

          const img = document.createElement("img")
          img.src = imageUrl
          img.alt = apiName
          img.style.maxWidth = "100%"
          img.style.height = "auto"
          img.style.borderRadius = "8px"

          modalRefs.content.innerHTML = ""
          modalRefs.content.appendChild(img)
          modalRefs.copyResponse.classList.add("d-none")
        } else {
          const data = await response.json()
          modalRefs.content.textContent = JSON.stringify(data, null, 2)
          modalRefs.copyResponse.classList.remove("d-none")
        }

        showToast("API request successful!", "success")
      } catch (error) {
        modalRefs.content.textContent = `Error: ${error.message}`
        showToast("API request failed", "error")
      } finally {
        modalRefs.spinner.classList.add("d-none")
        modalRefs.content.classList.remove("d-none")
      }
    }

    // Copy to clipboard function
    function copyToClipboard(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          showToast("Copied to clipboard!", "success")
        })
        .catch((err) => {
          showToast("Failed to copy text", "error")
          console.error("Could not copy text: ", err)
        })
    }

    // Toast notification function
    function showToast(message, type = "info") {
      const toastContainer = document.querySelector(".toast-container")
      const toast = document.createElement("div")
      toast.className = `toast ${type}`
      toast.innerHTML = `
            <div class="toast-content">
                <i class="bi ${type === "success" ? "bi-check-circle" : type === "error" ? "bi-x-circle" : "bi-info-circle"} me-2"></i>
                <span>${message}</span>
            </div>
        `
      toastContainer.appendChild(toast)

      setTimeout(() => {
        toast.style.opacity = "0"
        toast.style.transform = "translateX(100%)"
        setTimeout(() => {
          toast.remove()
        }, 300)
      }, 3000)
    }
  } catch (error) {
    console.error("Error loading settings:", error)
    showToast("Error loading application settings", "error")
  } finally {
    setTimeout(() => {
      loadingScreen.style.display = "none"
      body.classList.remove("no-scroll")

      // Add fade-in animation to main content
      document.querySelectorAll(".category-section").forEach((section, index) => {
        setTimeout(() => {
          section.classList.add("fade-in")
        }, index * 100)
      })
    }, 1000)
  }
})

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  const navbarBrand = document.querySelector(".navbar-brand")
  if (window.scrollY > 0) {
    navbarBrand.classList.add("visible")
    navbar.classList.add("scrolled")
  } else {
    navbarBrand.classList.remove("visible")
    navbar.classList.remove("scrolled")
  }
})

