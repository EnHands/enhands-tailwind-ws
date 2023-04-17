fetch('./blog/blogposts.json')
	.then(response => response.json())
	.then(blogposts => {
		let converter = new showdown.Converter();
		Promise.all(blogposts.map(blogpost => fetch(`./blog/${blogpost.name}.md`).then(response => response.text())))
			.then(markdownTexts => {

				for (i = 0; i < blogposts.length; i++) {

					let previewText = converter.makeHtml(markdownTexts[i]);
					let element = blogposts[i];

					previewTextElement = document.createElement("div")
					previewTextElement.innerHTML = previewText

					let blogpostPreviewElement = document.createElement("div")
					blogpostPreviewElement.innerHTML = (
						`<div class="mb-16 flex justify-center">
							<div class="flex flex-col lg:flex-row">
								<div class="mr-5 w-full lg:w-29% aspect-ratio-3/2 mb-3 lg:mb-0">
									<a href="/blogpost.html?post=${element['name']}">
									<img src="${element['picture']}" class="object-cover max-h-full w-full rounded">
									</a>
								</div>
								<div class="flex flex-col justify-between w-full lg:w-71%">
									<div>
										<div>
											<h2 class="text-2xl font-bold leading-8 tracking-tight"><a
													class="text-gray-900 dark:text-gray-100"
													href="/blogpost.html?post=${element['name']}">${element['title']}</a>
											</h2>
											<div class="flex flex-wrap">
												<div class="mr-3 text-sm font-medium text-blue-500 uppercase">${element['date']}
												</div>
											</div>
										</div>
									</div>
									<div>
										<div
											class="text-gray-500 max-w-none dark:text-gray-400 line-clamp max-h-24 overflow-hidden mb-2">
											<p>
												${previewTextElement.textContent}
											</p>
										</div>
										<div class="text-base font-medium leading-5"><a
												class="text-blue-500 dark:text-orange-500 hover:text-blue-600 dark:hover:text-orange-400"
												href="/blogpost.html?post=${element['name']}">Read post →</a>
										</div>
									</div>
								</div>
		
							</div>
						</div>`)
					blogPreviewContainer = document.getElementById("blogPreviewContainer")
					blogPreviewContainer.prepend(blogpostPreviewElement.firstChild)
				}
			});
	});
