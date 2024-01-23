document.addEventListener("DOMContentLoaded", function () {
    // Fetch posts data from the server
    fetch("/post-list") // Corrected endpoint
        .then((response) => response.json())
        .then((postsData) => {
            var postList = document.getElementById("postList");

            // Dynamically generate HTML for the posts
            postsData.forEach(function (post) {
                var postCard = document.createElement("div");
                postCard.id = `post-${post.id}`;
                postCard.className = "card mt-3";
                postCard.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${post.Title}</h5>
                        <p class="card-text">${post.Summary}</p>
                        <p class="card-text">${post.Body}</p>
                        <p class="card-text">Author: ${post.author_name}</p>
                        <button type="button" class="btn btn-primary btn-sm" onclick="viewPost(${post.id})">View Post</button>
                        <button type="button" class="btn btn-secondary btn-sm" onclick="deletePost(${post.id})">Delete Post</button>
                    </div>
                `;

                postList.appendChild(postCard);
            });
        })
        .catch((error) => console.error("Error fetching posts:", error));
});

function deletePost(postId) {
    // Make a DELETE request to the server to delete the post
    fetch(`/post-list/${postId}`, {
        method: "DELETE",
    })
        .then(response => response.json())
        .then(deletedPost => {
            // Remove the deleted post from the displayed list
            var postElement = document.getElementById(`post-${deletedPost.id}`);
            if (postElement) {
                postElement.remove();
            }
        })
        .catch((error) => console.error("Error deleting post:", error));
}

function viewPost(postId) {
    // Redirect to the post-details.html page with the selected post ID
    window.location.href = `/post-details.html?id=${postId}`;
}