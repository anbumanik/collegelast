"use client";
import { useState, useEffect } from "react";
import { rtdb } from "@/lib/firebase";
import { ref, push, set, onValue, remove } from "firebase/database";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [wallPosts, setWallPosts] = useState<any[]>([]); // Keep any for now as it's complex, but specify type if possible
  const [birthdayVideos, setBirthdayVideos] = useState<any[]>([]);
  const [mediaVaultItems, setMediaVaultItems] = useState<any[]>([]);
  const [heroImages, setHeroImages] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    setIsAuthenticated(true);
    
    // Fetch members
    const membersRef = ref(rtdb, 'members');
    onValue(membersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setMembers(items);
      } else {
        setMembers([]);
      }
    });

    // Fetch hero images
    const heroRef = ref(rtdb, 'hero_images');
    onValue(heroRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setHeroImages(items);
      } else {
        setHeroImages([]);
      }
    });

    // Fetch wall posts
    const wallRef = ref(rtdb, 'the_wall');
    onValue(wallRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        items.sort((a, b) => b.createdAt - a.createdAt);
        setWallPosts(items);
      } else {
        setWallPosts([]);
      }
    });

    // Fetch birthday videos
    const birthdayRef = ref(rtdb, 'birthday_videos');
    onValue(birthdayRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        items.sort((a, b) => b.createdAt - a.createdAt);
        setBirthdayVideos(items);
      } else {
        setBirthdayVideos([]);
      }
    });

    // Fetch media vault items
    const mediaRef = ref(rtdb, 'media_vault');
    onValue(mediaRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        items.sort((a, b) => b.createdAt - a.createdAt);
        setMediaVaultItems(items);
      } else {
        setMediaVaultItems([]);
      }
    });
  }, []);

  const [memberData, setMemberData] = useState({ name: "", imageUrl: "", gender: "boy", role: "Student", rollNumber: "" });
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [birthdayUrl, setBirthdayUrl] = useState({ url: "", name: "", description: "", type: "video" });
  const [mediaVaultData, setMediaVaultData] = useState({ url: "", type: "image", name: "" });
  const [heroImageUrl, setHeroImageUrl] = useState("");

  const handleAddHeroImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (heroImages.length >= 5) {
      alert("Maximum 5 Hero images allowed. Delete one to add a new one.");
      return;
    }
    try {
      const newRef = push(ref(rtdb, 'hero_images'));
      await set(newRef, { url: heroImageUrl, createdAt: Date.now() });
      alert("Hero image added!");
      setHeroImageUrl("");
    } catch (error) {
      console.error(error);
      alert("Error adding hero image");
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalImageUrl = memberData.imageUrl.trim() || "placeholder";
    
    try {
      if (editingMemberId) {
        // Update existing member
        await set(ref(rtdb, `members/${editingMemberId}`), {
          name: memberData.name,
          image: finalImageUrl,
          gender: memberData.gender,
          role: memberData.role,
          rollNumber: memberData.rollNumber,
          updatedAt: Date.now(),
        });
        alert("Member updated successfully!");
        setEditingMemberId(null);
      } else {
        // Add new member
        const newRef = push(ref(rtdb, 'members'));
        await set(newRef, {
          name: memberData.name,
          image: finalImageUrl,
          gender: memberData.gender,
          role: memberData.role,
          rollNumber: memberData.rollNumber,
          createdAt: Date.now(),
        });
        alert("Member added successfully!");
      }
      setMemberData({ name: "", imageUrl: "", gender: "boy", role: "Student", rollNumber: "" });
    } catch (error) {
      console.error(error);
      alert("Error saving member");
    }
  };

  const handleEditMember = (member: any) => {
    setMemberData({
      name: member.name,
      imageUrl: member.image,
      gender: member.gender,
      role: member.role || "Student",
      rollNumber: member.rollNumber || "",
    });
    setEditingMemberId(member.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddBirthday = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRef = push(ref(rtdb, 'birthday_videos'));
      await set(newRef, {
        url: birthdayUrl.url,
        name: birthdayUrl.name,
        description: birthdayUrl.description,
        type: birthdayUrl.type,
        createdAt: Date.now(),
      });
      alert("Birthday content added successfully!");
      setBirthdayUrl({ url: "", name: "", description: "", type: "video" });
    } catch (error) {
      console.error(error);
      alert("Error adding birthday content");
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRef = push(ref(rtdb, 'media_vault'));
      await set(newRef, {
        url: mediaVaultData.url,
        type: mediaVaultData.type,
        name: mediaVaultData.name,
        createdAt: Date.now(),
      });
      alert("Media added successfully!");
      setMediaVaultData({ url: "", type: "image", name: "" });
    } catch (error) {
      console.error(error);
      alert("Error adding media");
    }
  };

  const handleDeleteItem = async (collection: string, id: string) => {
    if (confirm(`Are you sure you want to delete this ${collection.replace('_', ' ')}?`)) {
      try {
        await remove(ref(rtdb, `${collection}/${id}`));
        alert("Item deleted!");
      } catch (error) {
        console.error(error);
        alert("Error deleting item");
      }
    }
  };

  const [wallStatus, setWallStatus] = useState("open");

  useEffect(() => {
    // ... existing fetchers ...
    
    // Fetch wall status
    const statusRef = ref(rtdb, 'wall_settings/status');
    onValue(statusRef, (snapshot) => {
      setWallStatus(snapshot.val() || "open");
    });
  }, []);

  const toggleWallStatus = async () => {
    const newStatus = wallStatus === "open" ? "closed" : "open";
    try {
      await set(ref(rtdb, 'wall_settings/status'), newStatus);
      alert(`The Wall is now ${newStatus === "open" ? "OPEN" : "STOPPED"} for posts.`);
    } catch (error) {
      console.error(error);
    }
  };

  if (!isAuthenticated) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
          <button onClick={() => window.location.href = '/'} className="bg-white/10 px-4 py-2 rounded hover:bg-white/20">Back to Site</button>
        </div>

        {/* Status Control Panel */}
        <div className="mb-12 glass-card p-6 rounded-3xl border-2 border-primary/20 bg-primary/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">System Controls</h2>
              <p className="text-white/40 text-sm">Manage global settings for the farewell portal.</p>
            </div>
            <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-primary font-bold">The Wall Status</span>
                <span className={`text-xl font-royal font-bold ${wallStatus === 'open' ? 'text-green-400' : 'text-red-400'}`}>
                  {wallStatus === 'open' ? '● ACTIVE' : '■ STOPPED'}
                </span>
              </div>
              <button 
                onClick={toggleWallStatus}
                className={`px-8 py-3 rounded-xl font-bold transition-all ${wallStatus === 'open' ? 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white' : 'bg-green-500/20 text-green-500 border border-green-500/50 hover:bg-green-500 hover:text-white'}`}
              >
                {wallStatus === 'open' ? 'STOP POSTING' : 'OPEN FOR POSTS'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hero Image Upload */}
          <div className="glass-card p-6 rounded-2xl md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 text-white">Manage Hero Section Images (Max 5)</h2>
            <form onSubmit={handleAddHeroImage} className="flex gap-4 mb-6">
              <input 
                type="url" 
                placeholder="Enter Hero Image URL" 
                required 
                className="flex-1 p-2 rounded bg-white text-black" 
                value={heroImageUrl} 
                onChange={e => setHeroImageUrl(e.target.value)} 
              />
              <button type="submit" className="bg-primary px-6 py-2 rounded font-bold hover:bg-primary/80">Add Image</button>
            </form>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {heroImages.map((img) => (
                <div key={img.id} className="relative group aspect-video rounded-lg overflow-hidden border border-white/10">
                  <img src={img.url} alt="Hero" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => handleDeleteItem('hero_images', img.id)}
                    className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs"
                  >
                    DELETE
                  </button>
                </div>
              ))}
              {heroImages.length === 0 && <p className="col-span-full text-center text-white/30 py-4 italic">No hero images added yet.</p>}
            </div>
          </div>

          {/* Member Upload / Edit */}
          <div className="glass-card p-6 rounded-2xl" id="member-form">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              {editingMemberId ? "Edit Member" : "Add Member"}
            </h2>
            <form onSubmit={handleAddMember} className="space-y-4 text-black">
              <input type="text" placeholder="Name" required className="w-full p-2 rounded bg-white/90" value={memberData.name} onChange={e => setMemberData({...memberData, name: e.target.value})} />
              <div className="flex gap-2">
                <input type="url" placeholder="Image URL (Optional)" className="flex-1 p-2 rounded bg-white/90" value={memberData.imageUrl} onChange={e => setMemberData({...memberData, imageUrl: e.target.value})} />
                <input type="number" placeholder="Roll No" required className="w-24 p-2 rounded bg-white/90" value={memberData.rollNumber} onChange={e => setMemberData({...memberData, rollNumber: e.target.value})} />
              </div>
              <select className="w-full p-2 rounded bg-white/90" value={memberData.gender} onChange={e => setMemberData({...memberData, gender: e.target.value})}>
                <option value="boy">Boy</option>
                <option value="girl">Girl</option>
              </select>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded font-bold hover:bg-primary/80 transition-colors">
                  {editingMemberId ? "Update Member" : "Upload Member"}
                </button>
                {editingMemberId && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingMemberId(null);
                      setMemberData({ name: "", imageUrl: "", gender: "boy", role: "Student", rollNumber: "" });
                    }}
                    className="bg-white/10 text-white px-4 py-2 rounded font-bold hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Birthday Upload */}
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-white">Add Birthday Content</h2>
            <form onSubmit={handleAddBirthday} className="space-y-4 text-black">
              <input type="text" placeholder="Title / Name" required className="w-full p-2 rounded bg-white/90" value={birthdayUrl.name} onChange={e => setBirthdayUrl({...birthdayUrl, name: e.target.value})} />
              <div className="flex gap-2">
                <input type="url" placeholder="URL (Image or Video)" required className="flex-1 p-2 rounded bg-white/90" value={birthdayUrl.url} onChange={e => setBirthdayUrl({...birthdayUrl, url: e.target.value})} />
                <select className="p-2 rounded bg-white/90" value={birthdayUrl.type} onChange={e => setBirthdayUrl({...birthdayUrl, type: e.target.value})}>
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                </select>
              </div>
              <textarea placeholder="Content Paragraph (Description)" required className="w-full p-2 rounded bg-white/90 h-24" value={birthdayUrl.description} onChange={e => setBirthdayUrl({...birthdayUrl, description: e.target.value})} />
              <button type="submit" className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-primary/80">Upload Birthday Content</button>
            </form>
          </div>

          {/* Media Vault Upload */}
          <div className="glass-card p-6 rounded-2xl md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 text-white">Add to Media Vault</h2>
            <form onSubmit={handleAddMedia} className="space-y-4 text-black">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input type="text" placeholder="Media Title" required className="w-full p-2 rounded bg-white/90" value={mediaVaultData.name} onChange={e => setMediaVaultData({...mediaVaultData, name: e.target.value})} />
                 <select className="w-full p-2 rounded bg-white/90" value={mediaVaultData.type} onChange={e => setMediaVaultData({...mediaVaultData, type: e.target.value})}>
                   <option value="image">Image</option>
                   <option value="video">Video</option>
                 </select>
              </div>
              <input type="url" placeholder="Media URL" required className="w-full p-2 rounded bg-white/90" value={mediaVaultData.url} onChange={e => setMediaVaultData({...mediaVaultData, url: e.target.value})} />
              <button type="submit" className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-primary/80">Upload Media</button>
            </form>
          </div>

          {/* Birthday Management */}
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4 text-white border-b border-white/10 pb-2">Manage Birthday Videos</h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {birthdayVideos.map((vid) => (
                <div key={vid.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex-1 mr-2 truncate">
                    <p className="text-sm font-medium text-white/90">{vid.name}</p>
                  </div>
                  <button onClick={() => handleDeleteItem('birthday_videos', vid.id)} className="text-red-400 hover:text-red-600 text-xs font-bold uppercase">Delete</button>
                </div>
              ))}
            </div>
          </div>

          {/* Media Vault Management */}
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4 text-white border-b border-white/10 pb-2">Manage Media Vault</h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {mediaVaultItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex-1 mr-2 truncate">
                    <p className="text-sm font-medium text-white/90">{item.name} <span className="text-[10px] opacity-30">({item.type})</span></p>
                  </div>
                  <button onClick={() => handleDeleteItem('media_vault', item.id)} className="text-red-400 hover:text-red-600 text-xs font-bold uppercase">Delete</button>
                </div>
              ))}
            </div>
          </div>

          {/* Members Management */}
          <div className="glass-card p-6 rounded-2xl md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-white border-b border-white/10 pb-2">Manage Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2">
              {members.map((m) => (
                <div key={m.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3 truncate">
                    <img src={m.image} className="w-8 h-8 rounded-full object-cover border border-white/10" alt="" />
                    <div className="truncate">
                      <p className="text-sm font-medium text-white/90 truncate">{m.name}</p>
                      <p className="text-[10px] text-primary font-bold">#{m.rollNumber}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 ml-2">
                    <button onClick={() => handleEditMember(m)} className="text-blue-400 hover:text-blue-500 text-[10px] font-bold uppercase">Edit</button>
                    <button onClick={() => handleDeleteItem('members', m.id)} className="text-red-400 hover:text-red-600 text-[10px] font-bold uppercase">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wall Management */}
          <div className="glass-card p-6 rounded-2xl md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-white border-b border-white/10 pb-2">Manage The Wall Posts</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {wallPosts.map((post) => (
                <div key={post.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex-1 mr-2">
                    <p className="text-sm text-white/90 line-clamp-1 italic">&quot;{post.text}&quot;</p>
                    <p className="text-[10px] text-primary">— {post.author}</p>
                  </div>
                  <button onClick={() => handleDeleteItem('the_wall', post.id)} className="text-red-400 hover:text-red-600 text-xs font-bold uppercase">Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
