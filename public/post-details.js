let postId;

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  postId = urlParams.get("id");

  const postDetailsContainer = document.getElementById("postDetails");
  const editButton = document.getElementById("editButton");
  const editForm = document.getElementById("editForm");
  const editTitleInput = document.getElementById("editTitle");
  const editSummaryInput = document.getElementById("editSummary");
  const editCommentsInput = document.getElementById("editComments");

  // Function to show the edit form
  function showEditForm() {
    editForm.style.display = "block";
    postDetailsContainer.style.display = "none";
  }

  // Function to hide the edit form
  function hideEditForm() {
    editForm.style.display = "none";
    postDetailsContainer.style.display = "block";
  }

  // Function to save changes when the "Save Changes" button is clicked
  function saveChanges() {
    const updatedPost = {
      title: editTitleInput.value,
      summary: editSummaryInput.value,
      comments: editCommentsInput.value,
    };

    // Send a PUT request to update the post
    fetch(`/post-list/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPost),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to update post: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((updatedPost) => {
        // Update the displayed post details
        postDetailsContainer.innerHTML = `
          <div class="card mt-3">
              <div class="card-body">
                  <h5 class="card-title" id="postTitle">${updatedPost.Title}</h5>
                  <p class="card-text" id="postSummary">${updatedPost.Summary}</p>
                  <p class="card-text" id="postBody">${updatedPost.Body}</p>
                  <p class="card-text">Author: ${updatedPost.author_name}</p>
              </div>
          </div>
        `;

        // Hide the edit form and show the updated post details
        hideEditForm();
      })
      .catch((error) => console.error("Error updating post:", error));
  }

  // Event listener for the "Edit" button
  editButton.addEventListener("click", showEditForm);

  // Event listener for the form submission
  editForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    saveChanges(); // Call the saveChanges function when the form is submitted
  });

  // Fetch post details and populate the page
  fetch(`/post-details?id=${postId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch post details: ${response.status} ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((postDetails) => {
      postDetailsContainer.innerHTML = `
          <div class="card mt-3">
              <div class="card-body">
                  <h5 class="card-title" id="postTitle">${postDetails.Title}</h5>
                  <p class="card-text" id="postSummary">${postDetails.Summary}</p>
                  <p class="card-text" id="postBody">${postDetails.Body}</p>
                  <p class="card-text">Author: ${postDetails.author_name}</p>
              </div>
          </div>
        `;

      editTitleInput.value = postDetails.Title;
        console.log(postDetails.Title)
      editSummaryInput.value = postDetails.Summary;
      editCommentsInput.value = postDetails.Body;
    })
    .catch((error) => console.error("Error updating post details:", error));
});
