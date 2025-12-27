import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import API from '../utils/apiClient';
import { sanitizeSlug, validateSlug, isSlugReserved } from '../utils/slugUtils';

const INITIAL_INSTALLATIONS = [];

export default function EventManager() {
  const [installations, setInstallations] = useState(INITIAL_INSTALLATIONS);
  const [showQR, setShowQR] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    location: '',
    status: 'Active'
  });
  const [slugError, setSlugError] = useState('');
  const [slugChecking, setSlugChecking] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const baseURL = window.location.origin;

  // Fetch installations on mount
  useEffect(() => {
    fetchInstallations();
  }, []);

  const fetchInstallations = async () => {
    try {
      setLoading(true);
      const response = await API.get('/installations');
      // If API returns empty array, use fallback data
      if (response.data && response.data.length === 0) {
        setInstallations([
          {
            id: '1',
            name: 'Breathing Pavilion',
            description: 'An interactive public art installation featuring illuminated columns that respond to community engagement.',
            image: '/Breathing_Pavilion.jpeg',
            location: 'Northern Manhattan',
            status: 'Closed'
          },
          {
            id: '2',
            name: 'Common Ground',
            description: 'A vibrant public plaza installation with colorful geometric patterns designed to foster community gathering.',
            image: '/Common_Ground.jpeg',
            location: 'Washington Heights',
            status: 'Active'
          },
          {
            id: '3',
            name: 'Los Circulos',
            description: 'Los Circulos (The Circles) is a sculptural installation that explores community gathering and public space through interconnected circular forms.',
            image: '/Los-Circulos-2.jpg',
            location: 'Washington Heights, NYC Parks',
            status: 'Active'
          }
        ]);
      } else {
        setInstallations(response.data);
      }
    } catch (error) {
      console.error('Error fetching installations:', error);
      // Fallback to demo data if API fails
      setInstallations([
        {
          id: '1',
          name: 'Breathing Pavilion',
          description: 'An interactive public art installation featuring illuminated columns that respond to community engagement.',
          image: '/Breathing_Pavilion.jpeg',
          location: 'Northern Manhattan',
          status: 'Closed'
        },
        {
          id: '2',
          name: 'Common Ground',
          description: 'A vibrant public plaza installation with colorful geometric patterns designed to foster community gathering.',
          image: '/Common_Ground.jpeg',
          location: 'Washington Heights',
          status: 'Active'
        },
        {
          id: '3',
          name: 'Los Circulos',
          description: 'Los Circulos (The Circles) is a sculptural installation that explores community gathering and public space through interconnected circular forms.',
          image: '/Los-Circulos-2.jpg',
          location: 'Washington Heights, NYC Parks',
          status: 'Active'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Show success message temporarily
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Auto-generate slug from name
  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({ ...prev, name }));

    // Auto-generate slug
    if (name) {
      const autoSlug = sanitizeSlug(name);
      setFormData(prev => ({ ...prev, slug: autoSlug }));

      // Validate the auto-generated slug
      const validation = validateSlug(autoSlug);
      if (!validation.valid) {
        setSlugError(validation.error);
      } else {
        setSlugError('');
        // Check availability
        checkSlugAvailability(autoSlug);
      }
    } else {
      setFormData(prev => ({ ...prev, slug: '' }));
      setSlugError('');
    }
  };

  // Check if slug is available (not already in use)
  const checkSlugAvailability = async (slug) => {
    if (!slug) return;

    setSlugChecking(true);
    try {
      const response = await API.get(`/check-slug/${slug}`);
      if (!response.data.available) {
        setSlugError(response.data.message);
      } else {
        setSlugError('');
      }
    } catch (error) {
      console.error('Error checking slug:', error);
    } finally {
      setSlugChecking(false);
    }
  };

  // Handle manual slug edit
  const handleSlugChange = (e) => {
    const slug = e.target.value;
    setFormData(prev => ({ ...prev, slug }));

    const validation = validateSlug(slug);
    if (!validation.valid) {
      setSlugError(validation.error);
    } else {
      setSlugError('');
      checkSlugAvailability(slug);
    }
  };

  // CREATE: Add new installation
  const handleAddInstallation = async () => {
    if (!formData.name || !formData.location) {
      alert('Please fill in at least name and location');
      return;
    }

    if (slugError) {
      alert('Please fix the slug error before creating the installation');
      return;
    }

    if (!formData.slug) {
      alert('Please provide a URL slug for the installation');
      return;
    }

    try {
      // Generate next numeric ID (count existing + 1)
      const numericId = (installations.length + 1).toString();

      const response = await API.post('/installations', {
        ...formData,
        numericId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      setInstallations([...installations, response.data]);
      showSuccess(`Successfully added "${formData.name}"`);
      setShowAddModal(false);
      setFormData({ name: '', slug: '', description: '', image: '', location: '', status: 'Active' });
      setSlugError('');
    } catch (error) {
      console.error('Error adding installation:', error);
      alert('Failed to add installation');
    }
  };

  // UPDATE: Edit existing installation
  const handleEditInstallation = async () => {
    try {
      await API.put(`/installations/${editingId}`, formData);
      setInstallations(installations.map(inst =>
        inst.id === editingId ? { ...inst, ...formData } : inst
      ));
      showSuccess(`Successfully updated "${formData.name}"`);
      setEditingId(null);
      setFormData({ name: '', description: '', image: '', location: '', status: 'Active' });
    } catch (error) {
      console.error('Error updating installation:', error);
      alert('Failed to update installation');
    }
  };

  // DELETE: Remove installation
  const handleDeleteInstallation = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await API.delete(`/installations/${id}`);
        setInstallations(installations.filter(inst => inst.id !== id));
        showSuccess(`Successfully deleted "${name}"`);
      } catch (error) {
        console.error('Error deleting installation:', error);
        alert('Failed to delete installation');
      }
    }
  };

  // Open edit modal with existing data
  const startEdit = (installation) => {
    setEditingId(installation.id);
    setFormData({
      name: installation.name,
      slug: installation.slug || '',
      description: installation.description,
      image: installation.image,
      location: installation.location,
      status: installation.status
    });
    setSlugError('');
  };

  // Cancel add/edit

  const cancelForm = () => {
    setShowAddModal(false);
    setEditingId(null);
    setFormData({ name: '', description: '', image: '', location: '', status: 'Active' });
  };

  const toggleQR = (id) => {
    setShowQR(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const downloadQR = (installation) => {
    const svg = document.getElementById(`qr-${installation.id}`);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${installation.name.replace(/\s+/g, '_')}_QR.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-vai-green text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {successMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-vai-black mb-1">
          Event & Installation Manager
        </h1>
        <p className="text-vai-grayText">
          Manage public art installations, view engagement metrics, and generate QR codes for survey distribution
        </p>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingId) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-heading font-bold text-vai-black mb-4">
              {editingId ? 'Edit Installation' : 'Add New Installation'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-vai-black mb-1">
                  Installation Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g., Breathing Pavilion"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-vai-black mb-1">
                  URL Slug *
                  <span className="text-xs text-gray-500 ml-2">
                    (auto-generated from name)
                  </span>
                </label>
                <div className="relative">
                  <Input
                    value={formData.slug}
                    onChange={handleSlugChange}
                    placeholder="e.g., breathing-pavilion"
                    className={`w-full pr-10 ${slugError ? 'border-red-500' : ''}`}
                  />
                  {slugChecking && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-2 border-vai-orange border-t-transparent rounded-full"></div>
                    </div>
                  )}
                  {!slugChecking && formData.slug && !slugError && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                      ✓
                    </div>
                  )}
                </div>
                {slugError && (
                  <p className="text-xs text-red-600 mt-1">{slugError}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Public URL: vai.vercel.app/{formData.slug || 'your-slug-here'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-vai-black mb-1">
                  Location *
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Northern Manhattan"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-vai-black mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the installation..."
                  className="w-full border border-vai-grayLight rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vai-orange"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-vai-black mb-1">
                  Image URL
                </label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/path/to/image.jpg"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-vai-black mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-vai-grayLight rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vai-orange"
                >
                  <option value="Active">Active</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="primary"
                onClick={editingId ? handleEditInstallation : handleAddInstallation}
                className="flex-1"
              >
                {editingId ? 'Update Installation' : 'Add Installation'}
              </Button>
              <Button
                variant="outline"
                onClick={cancelForm}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Installations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {installations.map((installation) => {
          const surveyURL = `${baseURL}/installation-selection?id=${installation.id}`;

          return (
            <Card key={installation.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Installation Image */}
              <div className="relative h-64 overflow-hidden -m-4 mb-4">
                <img
                  src={installation.image}
                  alt={installation.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23E1E0E1" width="400" height="300"/%3E%3Ctext fill="%23888888" font-family="system-ui" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage Not Found%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="absolute top-4 right-4">
                  <Badge active={installation.status === 'Active'}>
                    {installation.status}
                  </Badge>
                </div>
              </div>

              {/* Installation Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-vai-black mb-1">
                    {installation.name}
                  </h3>
                  <p className="text-sm text-vai-grayText mb-2">
                    {installation.location}
                  </p>
                  <p className="text-vai-black">
                    {installation.description}
                  </p>
                </div>

                {/* QR Code Section */}
                {showQR[installation.id] && (
                  <div className="bg-vai-bluePale/30 p-4 rounded-lg text-center space-y-3">
                    <div className="bg-white p-4 inline-block rounded-lg shadow-sm">
                      <QRCode
                        id={`qr-${installation.id}`}
                        value={`${baseURL}/survey?installationId=${installation.id}`}
                        size={200}
                        level="H"
                      />
                    </div>
                    <p className="text-xs text-vai-grayText break-all px-4">
                      {`${baseURL}/survey?installationId=${installation.id}`}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadQR(installation)}
                      className="w-full"
                    >
                      Download QR Code
                    </Button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={showQR[installation.id] ? "outline" : "primary"}
                    size="sm"
                    onClick={() => toggleQR(installation.id)}
                    className="flex-1"
                  >
                    {showQR[installation.id] ? 'Hide QR' : 'Show QR Code'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(installation)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteInstallation(installation.id, installation.name)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add New Installation Button */}
      <div className="flex justify-center pt-6">
        <Button
          variant="primary"
          className="px-8"
          onClick={() => setShowAddModal(true)}
        >
          Add New Installation
        </Button>
      </div>

      {/* CRUD Test Summary */}
      <Card className="mt-8 bg-vai-bluePale/20">
        <h3 className="text-lg font-heading font-semibold text-vai-black mb-3">
          CRUD Validation Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <span><strong>CREATE:</strong> Click "Add New Installation" to add new events</span>
          </div>
          <div>
            <span><strong>READ:</strong> All installations displayed in grid with details</span>
          </div>
          <div>
            <span><strong>UPDATE:</strong> Click "Edit" on any installation to modify</span>
          </div>
          <div>
            <span><strong>DELETE:</strong> Click "Delete" to remove (with confirmation)</span>
          </div>
          <div className="mt-4 p-3 bg-vai-orange/10 rounded border border-vai-orange/30">
            <p className="text-vai-black">
              <strong>Total Installations:</strong> {installations.length} |
              <strong className="ml-2">Active:</strong> {installations.filter(i => i.status === 'Active').length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
