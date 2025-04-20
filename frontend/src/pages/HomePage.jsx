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
    author: {
      name: "Alice Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    title: "Mastering NestJS Modules",
    content:
      "<p>Modules in NestJS allow developers to organize code by feature, enabling scalability and maintainability...</p>",
    images: [
      "https://miro.medium.com/v2/resize:fit:720/format:webp/0*1VyCqSN0pdtXitey.jpg",
    ],
    tags: ["#NestJS"],
    likes: 15,
    comments: [
      { user: "Tom", text: "Brilliant!" },
      { user: "Alice Johnson", text: "Thanks, Tom!" },
    ],
    showComments: false,
  },
  {
    id: 2,
    author: {
      name: "Evan Yu",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    title: "Top 5 TypeScript Tips for 2025",
    content:
      "<p>TypeScript continues to evolve... and these features help you write safer and more expressive code.</p>",
    images: [
      "https://cdn.thenewstack.io/media/2022/01/10b88c68-typescript-logo.png",
    ],
    tags: ["#TypeScript"],
    likes: 8,
    comments: [
      { user: "Sophia", text: "Nice!" },
      { user: "Evan Yu", text: "Appreciate it!" },
    ],
    showComments: false,
  },
  {
    id: 3,
    author: {
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    title: "Java Memory Management Explained",
    content:
      "<p>Understanding memory management in Java is crucial for building high-performance applications...</p>",
    images: [
      "https://tse1.mm.bing.net/th?id=OIP.umXj7kc766dOPpjavaBmLQHaEo&pid=Api&P=0&h=180",
    ],
    tags: ["#Java"],
    likes: 20,
    comments: [
      { user: "David", text: "🔥🔥🔥" },
      { user: "Michael Chen", text: "Glad you liked it!" },
    ],
    showComments: false,
  },
  {
    id: 4,
    author: {
      name: "Samantha Lee",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    title: "AI Workflows That Write Code For You",
    content:
      "<p>AI-assisted development is no longer a dream. With tools like Copilot, developers are automating boilerplate...</p>",
    images: [
      "https://tse3.mm.bing.net/th?id=OIP.Wwl0emuNFlQvfJZtXI4dzAHaEb&pid=Api&P=0&h=180",
    ],
    tags: ["#AI"],
    likes: 30,
    comments: [
      { user: "Raj", text: "This is the future!" },
      { user: "Samantha Lee", text: "Indeed, it's evolving fast!" },
    ],
    showComments: false,
  },
  {
    id: 5,
    author: {
      name: "Yuki Tanaka",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    title: "Scalable Systems with Microservices",
    content:
      "<p>Microservices enable independent deployment... and empower you to scale components individually.</p>",
    images: [
      "https://d1jnx9ba8s6j9r.cloudfront.net/blog/wp-content/uploads/2018/02/Differences-Between-Monolithic-Architecture-And-Microservices-Microservice-Architecture-Edureka.png",
    ],
    tags: ["#Microservices", "#Architecture"],
    likes: 12,
    comments: [
      { user: "Linda", text: "Neatly written!" },
      { user: "Yuki Tanaka", text: "Thanks Linda!" },
    ],
    showComments: false,
  },
  {
    id: 6,
    author: {
      name: "Carlos Rivera",
      avatar: "https://i.pravatar.cc/150?img=6",
    },
    title: "Build Your Personal Brand on LinkedIn",
    content:
      "<p>In 2025, devs who post regularly, showcase projects, and engage in tech discussions stand out...</p>",
    images: [
      "https://tse3.mm.bing.net/th?id=OIP.htIyuFyn_L57Db5JLvxB3AHaE8&pid=Api&P=0&h=180",
    ],
    tags: ["#Career", "#LinkedIn"],
    likes: 18,
    comments: [
      { user: "Meena", text: "This helped a lot!" },
      { user: "Carlos Rivera", text: "Glad to hear that 🙌" },
    ],
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
          {/* 🚀 Post Creator */}
          <section className="bg-white rounded-xl shadow-lg p-6 space-y-5">
            <h2 className="text-2xl font-bold text-gray-800">
              Create Something Awesome
            </h2>

            {/* Title Input */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Post Title
              </label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                placeholder="What's on your mind?"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Post Content
              </label>
              <ReactQuill
                theme="snow"
                value={newPost.content}
                onChange={(content) => setNewPost({ ...newPost, content })}
                className="mt-1 bg-white rounded-md"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Upload Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <div className="flex gap-3 mt-3 flex-wrap">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    className="w-24 h-24 object-cover rounded-md border shadow"
                    alt={`upload-${idx}`}
                  />
                ))}
              </div>
            </div>

            {/* Tags Input */}
            <div>
              <label className="text-sm font-medium text-gray-700">Tags</label>
              <input
                type="text"
                placeholder="#AI, #Java, #React"
                value={newPost.tags.join(",")}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    tags: e.target.value.split(",").map((tag) => tag.trim()),
                  })
                }
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="text-right">
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow"
              >
                🚀 Publish Post
              </button>
            </div>
          </section>

          {filteredPosts.map((post) => (
            <section
              key={post.id}
              className="bg-white p-5 rounded-xl shadow-md space-y-4 border"
            >
              {/* Author Info */}
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full border object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {post.author.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Software Engineer · 1h ago
                  </p>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>

              {/* Content */}
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="prose prose-sm max-w-none"
              />

              {/* Images */}
              <div className="flex flex-wrap gap-4 my-2">
                {post.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Post image ${idx}`}
                    className="w-full md:w-1/2 lg:w-[45%] xl:w-[30%] h-48 object-cover rounded-lg border shadow-sm"
                  />
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
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

              {/* Like + Comment Buttons */}
              <div className="flex justify-between items-center mt-3 border-t pt-3 text-sm text-gray-600">
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-1 hover:text-red-600 transition"
                  >
                    ❤️ <span>{post.likes}</span>{" "}
                    <span className="hidden sm:inline">Likes</span>
                  </button>

                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-1 hover:text-blue-600 transition"
                  >
                    💬 <span>{post.comments.length}</span>{" "}
                    <span className="hidden sm:inline">Comments</span>
                  </button>
                </div>
              </div>

              {/* Comment Section */}
              {post.showComments && (
                <div className="mt-3 bg-gray-50 rounded-lg p-4 border space-y-3">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addComment(post.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  />

                  <div className="space-y-2 max-h-44 overflow-y-auto">
                    {post.comments.map((comment, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 bg-white p-2 rounded border border-gray-100 shadow-sm text-sm text-gray-800"
                      >
                        <span className="text-blue-600 font-medium">
                          {comment.user}
                        </span>
                        <span className="text-gray-700">– {comment.text}</span>
                      </div>
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
