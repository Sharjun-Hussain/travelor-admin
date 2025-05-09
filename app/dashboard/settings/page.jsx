"use client"
import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Mail,
  CreditCard,
  LogOut
} from "lucide-react";
import { useState } from "react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true
  });

  return (
    <div className="flex h-full w-full flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500">
              Manage your account preferences
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="hidden w-64 border-r border-gray-200 bg-white p-6 md:block">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left ${activeTab === "general" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <Settings className="h-5 w-5" />
              <span>General</span>
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left ${activeTab === "account" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <User className="h-5 w-5" />
              <span>Account</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left ${activeTab === "security" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <Lock className="h-5 w-5" />
              <span>Security</span>
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left ${activeTab === "notifications" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </button>
            {/* Commented out other tabs
            <button
              onClick={() => setActiveTab("billing")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left ${activeTab === "billing" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <CreditCard className="h-5 w-5" />
              <span>Billing</span>
            </button>
            */}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="block w-full border-b border-gray-200 bg-white p-4 md:hidden">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="general">General</option>
            <option value="account">Account</option>
            <option value="security">Security</option>
            <option value="notifications">Notifications</option>
            {/* Commented out other options
            <option value="billing">Billing</option>
            */}
          </select>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  General Settings
                </h2>
                
                <div className="space-y-4">
                  {/* Commented out dark mode toggle
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Dark Mode</h3>
                      <p className="text-sm text-gray-500">
                        Switch between light and dark theme
                      </p>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>
                  */}

                  {/* Commented out language selector
                  <div>
                    <label htmlFor="language" className="mb-1 block font-medium text-gray-900">
                      Language
                    </label>
                    <select
                      id="language"
                      className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>French</option>
                      <option>Spanish</option>
                      <option>German</option>
                    </select>
                  </div>
                  */}

                  {/* Commented out timezone selector
                  <div>
                    <label htmlFor="timezone" className="mb-1 block font-medium text-gray-900">
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option>(GMT-12:00) International Date Line West</option>
                      <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                      <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                      <option>(GMT+00:00) Greenwich Mean Time</option>
                      <option>(GMT+01:00) Central European Time</option>
                      <option>(GMT+05:30) India Standard Time</option>
                    </select>
                  </div>
                  */}
                </div>
              </div>

              {/* Commented out appearance section
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Appearance
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-medium text-gray-900">
                      Primary Color
                    </h3>
                    <div className="flex gap-2">
                      {['blue', 'indigo', 'purple', 'pink', 'red', 'orange', 'green'].map((color) => (
                        <button
                          key={color}
                          className={`h-8 w-8 rounded-full bg-${color}-500`}
                          title={color.charAt(0).toUpperCase() + color.slice(1)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              */}
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Profile Information
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gray-200"></div>
                    <div>
                      <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        Change Avatar
                      </button>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, GIF or PNG. Max size of 2MB
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="first-name" className="mb-1 block font-medium text-gray-900">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first-name"
                        defaultValue="Admin"
                        className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="last-name" className="mb-1 block font-medium text-gray-900">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last-name"
                        defaultValue="User"
                        className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1 block font-medium text-gray-900">
                      Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        defaultValue="admin@example.com"
                        className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Password & Authentication
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="mb-1 block font-medium text-gray-900">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="current-password"
                      className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="new-password" className="mb-1 block font-medium text-gray-900">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="mb-1 block font-medium text-gray-900">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Notification Preferences
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 font-medium text-gray-900">
                      Email Notifications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-gray-900">
                            New bookings
                          </h4>
                          <p className="text-sm text-gray-500">
                            Get notified when new bookings are made
                          </p>
                        </div>
                        <button
                          onClick={() => setNotifications({...notifications, email: !notifications.email})}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.email ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-1'}`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-gray-900">
                            Cancellations
                          </h4>
                          <p className="text-sm text-gray-500">
                            Get notified when bookings are cancelled
                          </p>
                        </div>
                        <button
                          onClick={() => setNotifications({...notifications, email: !notifications.email})}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.email ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-1'}`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 font-medium text-gray-900">
                      SMS Notifications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-gray-900">
                            Booking confirmations
                          </h4>
                          <p className="text-sm text-gray-500">
                            Receive SMS when bookings are confirmed
                          </p>
                        </div>
                        <button
                          onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.sms ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.sms ? 'translate-x-6' : 'translate-x-1'}`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}