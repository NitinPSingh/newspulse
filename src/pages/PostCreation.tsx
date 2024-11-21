import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { usePost } from '../hooks/usePosts';
import useUser from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';


const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const PostCreationPage: React.FC = () => {
  const { createPost } = usePost(); 
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const {profile} = useUser()
  const navigate =useNavigate()
 

  const handleImageUpload = async (file: File) => {
    try {
      const uniqueFileName = `uploads/${Date.now()}-${file.name}`;
      
      const uploadParams = {
        Bucket: 'webcamrec',
        Key: uniqueFileName,
        Body: file,
        ContentType: file.type
      };

      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);

      const imageUrl = `https://webcamrec.s3.amazonaws.com/${uniqueFileName}`;
      setImageUrl(imageUrl);
      message.success('Image uploaded successfully');
      
      return imageUrl;
    } catch (error) {
      message.error('Image upload failed');
      console.error('Upload error:', error);
      return null;
    }
  };

  const handlePost = async () => {
    if (!title || !content) {
      message.error('Title and content are required');
      return;
    }

    const postData = {
      heading: title,
      context: content,
      tags: tags.split(',').map(tag => tag.trim()), 
      imageUrl
    };

    try {
      const authorId = profile?.id;  
      console.log(profile)

      const postWithTags = await createPost(postData, authorId);

      console.log(postWithTags)
      message.success('Post created successfully');
      navigate(`/post/${postWithTags?.id}`)
      
    } catch (error) {
      console.error('Error creating post:', error);
      message.error('Failed to create post');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
    
      <input 
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter post title"
        className="w-full p-2 mb-4 border rounded"
      />

      <ReactQuill 
        value={content}
        onChange={setContent}
        className="mb-4 h-[60vh]"
        modules={{
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline','strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
          ]
        }}
      />

      <div className="mb-4">
        <Upload
          beforeUpload={(file) => {
            handleImageUpload(file);
            return false; 
          }}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Uploaded" 
            className="mt-2 max-h-64 object-cover rounded"
          />
        )}
      </div>

      <input 
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Enter tags (comma separated)"
        className="w-full p-2 mb-4 border rounded"
      />

      <button 
        onClick={handlePost}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
      >
        Post
      </button>
    </div>
  );
};

export default PostCreationPage;
