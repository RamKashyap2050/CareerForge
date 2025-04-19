import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const mockTags = [
  "#AI",
  "#NestJS",
  "#Java",
  "#TypeScript",
  "#React",
  "#WebDevelopment",
  "#OpenSource",
  "#CareerGrowth",
];

const mockPosts = [
  {
    id: 1,
    title: "Mastering NestJS Modules",
    content:
      "<p>Modules in NestJS allow developers to organize code by feature, enabling scalability and maintainability. By encapsulating providers, controllers, and services within modules, large applications become easier to structure and navigate.</p>",
    images: [
      "https://miro.medium.com/v2/resize:fit:720/format:webp/0*1VyCqSN0pdtXitey.jpg",
    ],
    tags: ["#NestJS"],
    likes: 15,
    comments: ["Brilliant!", "So helpful 🙌"],
    showComments: false,
  },
  {
    id: 2,
    title: "Top 5 TypeScript Tips for 2025",
    content:
      "<p>TypeScript continues to evolve, and in 2025, advanced utility types, template literal types, and stricter null checks are essential tools to master. These features help you write safer and more expressive code effortlessly.</p>",
    images: [
      "https://cdn.thenewstack.io/media/2022/01/10b88c68-typescript-logo.png",
    ],
    tags: ["#TypeScript"],
    likes: 8,
    comments: ["Nice!", "Good read"],
    showComments: false,
  },
  {
    id: 3,
    title: "Java Memory Management Explained",
    content:
      "<p>Understanding memory management in Java—heap, stack, garbage collection—is crucial for building high-performance applications. Knowing how objects are stored and cleaned helps avoid memory leaks and optimize usage.</p>",
    images: [
      "https://tse1.mm.bing.net/th?id=OIP.umXj7kc766dOPpjavaBmLQHaEo&pid=Api&P=0&h=180",
    ],
    tags: ["#Java"],
    likes: 20,
    comments: ["🔥🔥🔥", "Very clear!"],
    showComments: false,
  },
  {
    id: 4,
    title: "AI Workflows That Write Code For You",
    content:
      "<p>AI-assisted development is no longer a dream. With tools like GitHub Copilot and ChatGPT API, developers are automating boilerplate and even architecture decisions, saving hours and unlocking creative potential.</p>",
    images: [
      "https://tse3.mm.bing.net/th?id=OIP.Wwl0emuNFlQvfJZtXI4dzAHaEb&pid=Api&P=0&h=180",
    ],
    tags: ["#AI"],
    likes: 30,
    comments: ["This is the future!", "💡 Useful insights!"],
    showComments: false,
  },
  {
    id: 5,
    title: "Building Scalable Systems with Microservices",
    content:
      "<p>Microservices enable independent deployment and better fault isolation. When combined with message queues and a solid API gateway strategy, they empower you to scale components individually without bringing down the system.</p>",
    images: [
      "https://d1jnx9ba8s6j9r.cloudfront.net/blog/wp-content/uploads/2018/02/Differences-Between-Monolithic-Architecture-And-Microservices-Microservice-Architecture-Edureka.png",
    ],
    tags: ["#Architecture", "#Microservices"],
    likes: 12,
    comments: ["Neatly written!", "👏"],
    showComments: false,
  },
  {
    id: 6,
    title: "How to Build Your Personal Brand on LinkedIn",
    content:
      "<p>In 2025, devs who post regularly, showcase projects, and engage in tech discussions stand out. LinkedIn is not just a job board—it's your portfolio and reputation rolled into one powerful platform.</p>",
    images: [
      "https://tse3.mm.bing.net/th?id=OIP.htIyuFyn_L57Db5JLvxB3AHaE8&pid=Api&P=0&h=180",
    ],
    tags: ["#Career", "#LinkedIn"],
    likes: 18,
    comments: ["Just what I needed!", "Thanks for this!"],
    showComments: false,
  },
];

const HomePage = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [filterTag, setFilterTag] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", content: "", tags: [] });
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages(imageUrls);
  };

  const handleSubmit = () => {
    if (!newPost.title || !newPost.content) return;
    const newEntry = {
      id: Date.now(),
      ...newPost,
      images,
      likes: 0,
      comments: [],
      showComments: false,
    };
    setPosts([newEntry, ...posts]);
    setNewPost({ title: "", content: "", tags: [] });
    setImages([]);
  };

  const toggleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const addComment = (id, comment) => {
    if (!comment) return;
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );
  };

  const toggleComments = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, showComments: !post.showComments } : post
      )
    );
  };

  const filteredPosts = filterTag
    ? posts.filter((p) => p.tags.includes(filterTag))
    : posts;

  const tagBadgeColors = {
    "#AI": "bg-purple-100 text-purple-800",
    "#NestJS": "bg-green-100 text-green-800",
    "#Java": "bg-yellow-100 text-yellow-800",
    "#TypeScript": "bg-blue-100 text-blue-800",
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-1/5 p-4 border-r bg-white hidden md:block">
          <h2 className="text-xl font-bold mb-4">Trending Tags</h2>
          <ul className="flex flex-wrap gap-2">
            {mockTags.map((tag) => (
              <li
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium 
        ${
          filterTag === tag
            ? "bg-blue-600 text-white"
            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
        } transition duration-200`}
              >
                {tag}
              </li>
            ))}
          </ul>

          {filterTag && (
            <button
              className="mt-4 text-sm text-gray-600"
              onClick={() => setFilterTag(null)}
            >
              Clear Filter
            </button>
          )}
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-4/5 p-6 space-y-8">
          {/* Post Creator */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Create Post</h2>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              placeholder="Post Title"
              className="w-full border p-2 mb-2 rounded"
            />
            <ReactQuill
              theme="snow"
              value={newPost.content}
              onChange={(content) => setNewPost({ ...newPost, content })}
              className="mb-2"
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="mb-2"
            />
            <div className="flex gap-2 mb-2 flex-wrap">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  className="w-20 h-20 object-cover rounded border"
                  alt={`upload-${idx}`}
                />
              ))}
            </div>
            <input
              type="text"
              placeholder="Tags (e.g., #AI,#Java)"
              value={newPost.tags.join(",")}
              onChange={(e) =>
                setNewPost({
                  ...newPost,
                  tags: e.target.value.split(",").map((tag) => tag.trim()),
                })
              }
              className="w-full border p-2 mb-2 rounded"
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Post
            </button>
          </section>

          {/* Post Feed */}
          {filteredPosts.map((post) => (
            <section
              key={post.id}
              className="bg-white p-4 rounded shadow space-y-3"
            >
              <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="prose"
              />
              <div className="flex flex-wrap gap-4 my-3">
                {post.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Post image ${idx}`}
                    className="w-full md:w-1/2 lg:w-[45%] xl:w-[30%] h-48 object-cover rounded-lg border shadow"
                  />
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-1">
                {post.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      tagBadgeColors[tag] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={() => toggleLike(post.id)}
                  className="text-sm text-gray-600 hover:underline"
                >
                  ❤️ {post.likes} Likes
                </button>
                <button
                  onClick={() => toggleComments(post.id)}
                  className="text-sm text-gray-600 hover:underline"
                >
                  💬 {post.comments.length} Comments
                </button>
              </div>

              {post.showComments && (
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addComment(post.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="border p-1 text-sm rounded w-full"
                  />
                  <div className="text-sm text-gray-700 space-y-1">
                    {post.comments.map((c, i) => (
                      <div key={i}>💬 {c}</div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          ))}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
