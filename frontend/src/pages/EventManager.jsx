import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Target, Edit2, Trash2, QrCode, Plus, Save, X, Download, Check } from 'lucide-react';

const INITIAL_INSTALLATIONS = [
  {
    id: '1',
    name: 'Breathing Pavilion',
    description: 'An interactive public art installation featuring illuminated columns that respond to community engagement.',
    image: '/Breathing_Pavilion.jpeg',
    location: 'Northern Manhattan',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Common Ground',
    description: 'A vibrant public plaza installation with colorful geometric patterns designed to foster community gathering.',
    image: '/Common_Ground.jpeg',
    location: 'Washington Heights',
    status: 'Active'
  }
];

export default function EventManager() {
  const [installations, setInstallations] = useState(INITIAL_INSTALLATIONS);
  const [showQR, setShowQR] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    location: '',
    status: 'Active'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const baseURL = window.location.origin;

  // Show success message temporarily
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // CREATE: Add new installation
  const handleAddInstallation = () => {
    if (!formData.name || !formData.location) {
      alert('Please fill in at least name and location');
      return;
    }

    const newInstallation = {
      id: Date.now().toString(),
      ...formData
    };

    setInstallations([...installations, newInstallation]);
    showSuccess(`Successfully added "${formData.name}"`);
    setShowAddModal(false);
    setFormData({ name: '', description: '', image: '', location: '', status: 'Active' });
  };

  // UPDATE: Edit existing installation
  const handleEditInstallation = () => {
    setInstallations(installations.map(inst =>
      inst.id === editingId ? { ...inst, ...formData } : inst
    ));
    showSuccess(`Successfully updated "${formData.name}"`);
    setEditingId(null);
    setFormData({ name: '', description: '', image: '', location: '', status: 'Active' });
  };

  // DELETE: Remove installation
  const handleDeleteInstallation = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      setInstallations(installations.filter(inst => inst.id !== id));
      showSuccess(`Successfully deleted "${name}"`);
    }
  };

  // Open edit modal with existing data
  const startEdit = (installation) => {
    setEditingId(installation.id);
    setFormData({
      name: installation.name,
      description: installation.description,
      image: installation.image,
      location: installation.location,
      status: installation.status
    });
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
        <h1 className="text-3xl font-semibold text-vai-black mb-1 flex items-center gap-2">
          <Target className="w-8 h-8 text-vai-orange" strokeWidth={1.5} />
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
            <h2 className="text-2xl font-heading font-bold text-vai-black mb-4 flex items-center gap-2">
              {editingId ? (
                <>
                  <Edit2 className="w-6 h-6 text-vai-orange" strokeWidth={1.5} />
                  Edit Installation
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6 text-vai-orange" strokeWidth={1.5} />
                  Add New Installation
                </>
              )}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-vai-black mb-1">
                  Installation Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Breathing Pavilion"
                  className="w-full"
                />
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
                className="flex-1 flex items-center justify-center gap-1.5"
              >
                {editingId ? (
                  <>
                    <Save className="w-4 h-4" strokeWidth={1.5} />
                    Update Installation
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" strokeWidth={1.5} />
                    Add Installation
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={cancelForm}
                className="flex-1 flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
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
                    📍 {installation.location}
                  </p>
                  <p className="text-vai-black">
                    {installation.description}
                  </p>
                </div>

                {/* QR Code Section */}
                {showQR[installation.id] && (
                  <div className="bg-vai-bluePale/30 p-4 rounded-lg text-center space-y-3">
                    <div className="bg-white p-4 inline-block rounded-lg shadow-sm">
                      <QRCodeSVG
                        id={`qr-${installation.id}`}
                        value={surveyURL}
                        size={200}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <p className="text-xs text-vai-grayText break-all px-4">
                      {surveyURL}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadQR(installation)}
                      className="w-full flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-4 h-4" strokeWidth={1.5} />
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
                    className="flex-1 flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" strokeWidth={1.5} />
                    {showQR[installation.id] ? 'Hide QR' : 'Show QR Code'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(installation)}
                    className="flex items-center gap-1.5"
                  >
                    <Edit2 className="w-4 h-4" strokeWidth={1.5} />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteInstallation(installation.id, installation.name)}
                    className="text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
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
          className="px-8 flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-5 h-5" strokeWidth={1.5} />
          Add New Installation
        </Button>
      </div>

      {/* CRUD Test Summary */}
      <Card className="mt-8 bg-vai-bluePale/20">
        <h3 className="text-lg font-heading font-semibold text-vai-black mb-3 flex items-center gap-2">
          <Check className="w-5 h-5 text-vai-orange" strokeWidth={1.5} />
          CRUD Validation Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-vai-green" strokeWidth={2} />
            <span><strong>CREATE:</strong> Click "Add New Installation" to add new events</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-vai-green" strokeWidth={2} />
            <span><strong>READ:</strong> All installations displayed in grid with details</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-vai-green" strokeWidth={2} />
            <span><strong>UPDATE:</strong> Click "Edit" on any installation to modify</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-vai-green" strokeWidth={2} />
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
