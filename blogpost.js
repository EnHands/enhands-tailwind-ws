let blogposts = null

fetch('./blogposts.json')
	.then((response) => response.json())
	.then((_blogposts) => {
		blogposts = _blogposts
		fetch('./blogposts.json')
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);

		headingContainer = document.getElementById("blogpostHeadingContainer");
		imageContainer = document.getElementById("blogpostImageContainer");
		textContainer = document.getElementById("blogpostTextContainer");
		dateContainer = document.getElementById("blogpostDateContainer");

		matchingBlogposts = blogposts.filter(p => p.name == urlParams.get("post"));
		if (matchingBlogposts.length == 0) {
			blogpost = { "name": "", "picture": "", "date": "", "title": "" };
		} else {
			blogpost = matchingBlogposts[0];
		}

		fetch(`./blog/${blogpost.name}.md`)
			.then(response => response.text())
			.then(blogpostText => {
				let converter = new showdown.Converter();
				let textHtml = converter.makeHtml(blogpostText);

				headingContainer.innerHTML = blogpost["title"];
				imageContainer.src = blogpost["picture"];
				textContainer.innerHTML = textHtml;
				dateContainer.innerHTML = blogpost["date"];
			});
	});