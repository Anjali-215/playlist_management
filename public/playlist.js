// Get token from localStorage
const token = localStorage.getItem('token');

// Check if user is logged in
if (!token) {
    window.location.href = 'login.html';
}

// Load playlists when page loads
document.addEventListener('DOMContentLoaded', loadPlaylists);

// Load all playlists
async function loadPlaylists() {
    try {
        const response = await fetch('http://localhost:3002/api/playlists', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch playlists');
        }

        const playlists = await response.json();
        const playlistContainer = document.getElementById('playlistContainer');
        playlistContainer.innerHTML = '';

        playlists.forEach(playlist => {
            const playlistCard = createPlaylistCard(playlist);
            playlistContainer.appendChild(playlistCard);
        });
    } catch (error) {
        console.error('Error loading playlists:', error);
        alert('Failed to load playlists. Please try again.');
    }
}

// Create playlist card element
function createPlaylistCard(playlist) {
    const card = document.createElement('div');
    card.className = 'playlist-card';
    card.setAttribute('data-playlist-id', playlist._id);
    card.innerHTML = `
        <div class="playlist-info">
            <div class="playlist-icon">
                <i class="fas fa-music"></i>
            </div>
            <h3>${playlist.name}</h3>
        </div>
        <div class="playlist-actions">
            <button onclick="editPlaylist('${playlist._id}')" class="btn-edit">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button onclick="deletePlaylist('${playlist._id}')" class="btn-delete">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    return card;
}

// Create new playlist
async function createPlaylist(event) {
    event.preventDefault();
    const name = document.getElementById('playlistName').value;

    try {
        const response = await fetch('http://localhost:3002/api/playlists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        });

        if (!response.ok) {
            throw new Error('Failed to create playlist');
        }

        const playlist = await response.json();
        const playlistContainer = document.getElementById('playlistContainer');
        const playlistCard = createPlaylistCard(playlist);
        playlistContainer.appendChild(playlistCard);

        // Close modal and reset form
        document.getElementById('createPlaylistModal').style.display = 'none';
        document.getElementById('playlistForm').reset();
    } catch (error) {
        console.error('Error creating playlist:', error);
        alert('Failed to create playlist. Please try again.');
    }
}

// Edit playlist
async function editPlaylist(playlistId) {
    try {
        const response = await fetch(`http://localhost:3002/api/playlists/${playlistId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch playlist details');
        }

        const playlist = await response.json();
        const modal = document.getElementById('editPlaylistModal');
        document.getElementById('editPlaylistName').value = playlist.name;
        document.getElementById('editPlaylistForm').onsubmit = (e) => updatePlaylist(e, playlistId);
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error editing playlist:', error);
        alert('Failed to load playlist details. Please try again.');
    }
}

// Update playlist
async function updatePlaylist(event, playlistId) {
    event.preventDefault();
    const name = document.getElementById('editPlaylistName').value;

    try {
        const response = await fetch(`http://localhost:3002/api/playlists/${playlistId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        });

        if (!response.ok) {
            throw new Error('Failed to update playlist');
        }

        const updatedPlaylist = await response.json();
        const playlistCard = document.querySelector(`[data-playlist-id="${playlistId}"]`);
        if (playlistCard) {
            playlistCard.replaceWith(createPlaylistCard(updatedPlaylist));
        }

        document.getElementById('editPlaylistModal').style.display = 'none';
    } catch (error) {
        console.error('Error updating playlist:', error);
        alert('Failed to update playlist. Please try again.');
    }
}

// Delete playlist
async function deletePlaylist(playlistId) {
    if (!confirm('Are you sure you want to delete this playlist?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3002/api/playlists/${playlistId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete playlist');
        }

        const playlistCard = document.querySelector(`[data-playlist-id="${playlistId}"]`);
        if (playlistCard) {
            playlistCard.remove();
        }
    } catch (error) {
        console.error('Error deleting playlist:', error);
        alert('Failed to delete playlist. Please try again.');
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}
