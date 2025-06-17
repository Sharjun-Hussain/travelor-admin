// components/entity-management.tsx
import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  Plus,
  Search,
  MoreHorizontal,
  Trash,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  SlidersHorizontal,
  Building2,
  User,
  Mail,
  Calendar,
  Star,
  MapPin,
  Hotel,
  Home,
  Phone,
  Globe,
  X,
  Check,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { exportToExcel } from "@/lib/utils";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

const defaultStatusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "inactive", label: "Inactive" },
];

const defaultRenderStatusBadge = (status) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0">
          <CheckCircle2 className="mr-1 h-3 w-3" /> Active
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">
          <Clock className="mr-1 h-3 w-3" /> Pending
        </Badge>
      );
    case "inactive":
      return (
        <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-0">
          <XCircle className="mr-1 h-3 w-3" /> Inactive
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const EntityManagement = ({
  entityName = "host",
  entityPlural = "hosts",
  fetchEntities,
  addEntity,
  updateEntity,
  deleteEntity,
  columns,
  statusOptions = defaultStatusOptions,
  defaultPageSize = 10,
  enableTabs = true,
  enableSearch = true,
  enableFilters = true,
  enableExport = true,
  customFilters,
  onEntityClick,
  renderStatusBadge = defaultRenderStatusBadge,
  additionalTabs = [],
  headerTitle = "Management",
  headerDescription = `Manage all your ${entityPlural}`,
  addButtonLabel = `Add New ${entityName.charAt(0).toUpperCase() + entityName.slice(1)
  }`,
  emptyState,
  createForm,
  editForm,
  viewDetails,
  initialFormData = {
    propertyType: "villa",
    name: "",
    unitType: "",           // No default (enum: entire_home, private_room, etc.)
    maxGuests: 2,           // Default as per your table
    maxChildren: 0,         // Default
    maxInfants: 0,          // Default
    bedroomCount: 1,        // Default
    bathroomCount: 1,       // Default
    attachedBathrooms: 0,   // Default
    sharedBathrooms: 0,     // Default
    bathroomType: "",       // No default (enum: private, shared, etc.)
    hasHotWater: true,      // Default
    floorNumber: null,      // Omit for ground floor
    size: null,             // No default
    hasKitchen: false,      // Default
    kitchenType: "",        // No default (enum: full, partial, etc.)
    hasLivingRoom: false,   // Default
    hasDiningArea: false,   // Default
    hasBalcony: false,      // Default
    hasGarden: false,       // Default
    hasPoolAccess: false,   // Default
    basePrice: 0.00,        // Required but zero-init
    cleaningFee: 0.00,      // Default
    securityDeposit: 0.00,  // Default
    extraGuestFee: 0.00,    // Default
    minimumStay: 1,         // Default (min 1 night)
    smokingAllowed: false,  // Default
    petsAllowed: false,     // Default
    eventsAllowed: false,   //
    address: "",
    city: "",
    district: "",
    province: "",
    country: "Sri Lanka",
    postalCode: "",
    cancellationPolicy: "moderate",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    description: "",
    isActive: true,
    vistaVerified: false,
    phone: "",
    email: "",
    website: "",
    latitude: "",
    longitude: "",
    availabilityStatus: "available",
    approvalStatus: "pending",
    amenities: [],
    images: [],
  },
  defaultSort = { key: "name", direction: "asc" },
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortConfig, setSortConfig] = useState(defaultSort);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEntity, setCurrentEntity] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const queryClient = useQueryClient();
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fetchedAmanities, setfetchedAmanities] = useState([])

  useEffect(() => {

    const fetchAmenities = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/amenities`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setfetchedAmanities(response.data?.data)
      } else {
        toast.error("Failed to fetch amenities", {
          description: "Please try again later.",
        });
      }

    }
    fetchAmenities()

  }, [])


  // Query hooks
  const {
    data: entities = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [entityPlural],
    queryFn: fetchEntities,
  });

  // Mutation hooks
  const addMutation = useMutation({
    mutationFn: addEntity,
    onSuccess: (newEntity) => {
      queryClient.setQueryData([entityPlural], (old = []) => [
        ...old,
        newEntity,
      ]);
      toast.success(
        `${entityName.charAt(0).toUpperCase() + entityName.slice(1)
        } added successfully`,
        {
          description: `${newEntity.name || newEntity.title
            } has been added to your ${entityName} list.`,
        }
      );
      setIsAddDialogOpen(false);
      setFormData(initialFormData);
    },
    onError: (error) => {
      toast.error(`Failed to add ${entityName}`, {
        description:
          error.message ||
          `There was an error adding the ${entityName}. Please try again.`,
      });
    },
  });
  const updateMutation = useMutation({
    mutationFn: updateEntity,
    onSuccess: (updatedEntity) => {
      queryClient.setQueryData([entityPlural], (old = []) =>
        old.map((entity) =>
          entity.id === updatedEntity.id ? updatedEntity : entity
        )
      );
      toast.success("Changes saved", {
        description: `${updatedEntity.name}'s information has been updated.`,
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to update ${entityName}`, {
        description: `There was an error updating the ${entityName}. Please try again.`,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEntity,
    onSuccess: (id) => {
      queryClient.setQueryData([entityPlural], (old = []) =>
        old.filter((entity) => entity.id !== id)
      );
      toast.error(
        `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} removed`,
        {
          description: `The ${entityName} has been successfully removed from your platform.`,
        }
      );
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to delete ${entityName}`, {
        description: `There was an error deleting the ${entityName}. Please try again.`,
      });
    },
  });

  // Filter and sort entities
  const filteredEntities = entities.filter((entity) => {
    const matchesSearch =
      entity.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && entity.isActive) ||
      (statusFilter === "pending" && entity.approvalStatus === "pending") ||
      (statusFilter === "inactive" && !entity.isActive);

    return matchesSearch && matchesStatus;
  });

  // Sort entities
  const sortedEntities = [...filteredEntities].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle string comparison
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const paginatedEntities = sortedEntities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(sortedEntities.length / pageSize);

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckChange = (value) => {
    setFormData((prev) => {
      const isSelected = prev.amenities.includes(value);
      const updatedAmenities = isSelected
        ? prev.amenities.filter((id) => id !== value)
        : [...prev.amenities, value];

      // 🔔 Alert right after calculating the new state


      return { ...prev, amenities: updatedAmenities };
    });
  };

  const handleAddEntity = async (e) => {
    e.preventDefault();

    const newformdata = new FormData();
    newformdata.append("title", formData.title);
    newformdata.append("propertyType", formData.propertyType);
    newformdata.append("address", formData.address);
    newformdata.append("city", formData.city);
    newformdata.append("district", formData.district);
    newformdata.append("province", formData.province);
    newformdata.append("country", formData.country);
    newformdata.append("description", formData.description);
    newformdata.append("email", formData.email);
    newformdata.append("website", formData.website);
    newformdata.append("postalCode", "12122");
    newformdata.append("latitude", formData.latitude);
    newformdata.append("longitude", formData.longitude);
    newformdata.append("phone", formData.phone);
    newformdata.append("checkInTime", formData.checkInTime);
    newformdata.append("cancellationPolicy", formData.cancellationPolicy);
    newformdata.append("checkOutTime", formData.checkOutTime);
    formData.amenities.forEach(id => {
      newformdata.append("amenities", id);
    });
    selectedFiles.forEach((file) => {
      newformdata.append("images", file);
    });

    //need to remove before production
    for (let [key, value] of newformdata.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, value.name, value.type, value.size);
      } else {
        console.log(`${key}:`, value);
      }
    }

    if (addEntity) {
      addMutation.mutate(newformdata);
    }
  };

  const handleUpdateEntity = async (e) => {
    e.preventDefault();

    if (!currentEntity) return;

    const updatedFormData = new FormData();
    updatedFormData.append("id", currentEntity.id);
    updatedFormData.append("title", formData.title);
    updatedFormData.append("propertyType", formData.propertyType);
    updatedFormData.append("address", formData.address);
    updatedFormData.append("city", formData.city);
    updatedFormData.append("district", formData.district);
    updatedFormData.append("province", formData.province);
    updatedFormData.append("country", formData.country);
    updatedFormData.append("description", formData.description);
    updatedFormData.append("email", formData.email);
    updatedFormData.append("website", formData.website);
    updatedFormData.append("postalCode", "12122"); // Update with actual value if needed
    updatedFormData.append("latitude", formData.latitude);
    updatedFormData.append("longitude", formData.longitude);
    updatedFormData.append("phone", formData.phone);
    updatedFormData.append("checkInTime", formData.checkInTime);
    updatedFormData.append("cancellationPolicy", formData.cancellationPolicy);
    updatedFormData.append("checkOutTime", formData.checkOutTime);
    updatedFormData.append("vistaVerified", formData.vistaVerified);
    updatedFormData.append("isActive", formData.isActive);

    // Append amenities
    formData.amenities.forEach(id => {
      updatedFormData.append("amenities", id);
    });

    // Append new images
    selectedFiles.forEach(file => {
      updatedFormData.append("images", file);
    });

    updateMutation.mutate(updatedFormData);
  };

  const handleDeleteEntity = () => {
    if (deleteEntity && currentEntity) {
      deleteMutation.mutate(currentEntity.id);
    }
  };

  const openEditDialog = (entity) => {
    setCurrentEntity(entity);
    // Transform amenities to array of IDs
    const amenityIds = entity.amenities?.map(a => a.id) || [];

    // Transform images to array of URLs
    const imageUrls = entity.images?.map(img => img.imageUrl) || [];

    setFormData({
      ...initialFormData,
      ...entity,
      amenities: amenityIds,
      images: imageUrls
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (entity) => {
    setCurrentEntity(entity);
    setIsViewDialogOpen(true);
    if (onEntityClick) {
      onEntityClick(entity);
    }
  };

  const handleAcceptEntity = async (id) => {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/properties/${id}/approval-status`,
      {
        "approvalStatus": "approved"
      },
      {

        withCredentials: true,
      }
    );

  }

  const handleDeclineEntity = async (id) => {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/properties/${id}/approval-status`,
      {
        "approvalStatus": "declined"
      },
      {
        withCredentials: true,
      }
    );

  }

  const openDeleteDialog = (entity) => {
    setCurrentEntity(entity);
    setIsDeleteDialogOpen(true);
  };
  const handleImageUpload = async (e) => {
    console.log("File input ref:", fileInputRef.current);
    console.log("Files:", fileInputRef.current?.files);
    console.log("File count:", fileInputRef.current?.files?.length);
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    console.log("Selected files:", files);
    setUploadingImages(true);

    setSelectedFiles(files);

    try {
      const uploadedUrls = await Promise.all(
        files.map((file) => {
          return new Promise((resolve) => {
            // Simulate upload delay
            setTimeout(() => {
              const url = URL.createObjectURL(file);
              resolve(url);
            }, 1000);
          });
        })
      );

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      // toast.success("Images uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload images", {
        description: error.message || "Please try again",
      });
    } finally {
      setUploadingImages(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  if (isLoading) {
    return (
      <div className="container items-center mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64 lg:h-96">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-t-indigo-500 border-r-indigo-300 border-b-indigo-500 border-l-indigo-300 animate-spin"></div>
            <div className="mt-4 text-lg font-medium text-slate-700">
              Loading {entityPlural} data...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="p-6 max-w-3xl bg-white rounded-lg border border-red-200 shadow-md">
          <XCircle className="h-12 w-12 text-red-500 mb-4" />
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
            Error loading data
          </h5>
          <p className="mb-3 text-gray-700">
            Unable to load {entityPlural} data. Please try again or contact
            support if the problem persists.
          </p>
          <Button onClick={() => queryClient.invalidateQueries([entityPlural])}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const visibleColumns = columns.filter((col) => col.visible !== false);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        {/* Header Section with gradient */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-8 mb-4">
          <div className="flex md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-5xl font-bold tracking-tight">
                {headerTitle}
              </h1>
              <p className="mt-2">{headerDescription}</p>
            </div>
            {addEntity && (
              <Button
                onClick={() => {
                  setFormData(initialFormData);
                  setIsAddDialogOpen(true);
                }}
                className="bg-white text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 transition-colors shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" /> {addButtonLabel}
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          {enableTabs && (
            <TabsList className="mb-4 bg-slate-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All{" "}
                {entityPlural.charAt(0).toUpperCase() + entityPlural.slice(1)}
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="data-[state=active]:bg-white"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-white"
              >
                Pending Approval
              </TabsTrigger>
              <TabsTrigger
                value="inactive"
                className="data-[state=active]:bg-white"
              >
                Inactive
              </TabsTrigger>
              {additionalTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-white"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          )}

          <TabsContent value="all" className="mt-0">
            {/* Search & Filter Row */}
            {(enableSearch || enableFilters) && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                {enableSearch && (
                  <div className="md:col-span-6 lg:col-span-5">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder={`Search ${entityPlural} by name, email, location...`}
                        className="pl-10 border-slate-300 focus-visible:ring-indigo-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                <div
                  className={`${enableSearch
                    ? "md:col-span-6 lg:col-span-7"
                    : "md:col-span-12"
                    } flex flex-wrap justify-start md:justify-end gap-2`}
                >
                  {enableFilters && (
                    <>
                      <Select
                        value={statusFilter}
                        onValueChange={(value) => setStatusFilter(value)}
                      >
                        <SelectTrigger className="w-[140px] border-slate-300">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button variant="outline" className="border-slate-300">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        More Filters
                      </Button>
                    </>
                  )}

                  {customFilters}

                  {enableExport && (
                    <Button
                      variant="outline"
                      className="border-slate-300"
                      onClick={() => exportToExcel(entities, "Activities")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Entity Listing Table */}
            <div className="overflow-hidden border rounded-md">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow className="hover:bg-slate-50 border-slate-200">
                        {visibleColumns.map((column) => (
                          <TableHead
                            key={column.key}
                            className={`font-semibold text-slate-700 ${column.sortable ? "cursor-pointer" : ""
                              } ${column.className || ""}`}
                            onClick={() =>
                              column.sortable && requestSort(column.key)
                            }
                          >
                            <div className="flex items-center">
                              {column.label}
                              {sortConfig.key === column.key && (
                                <ChevronDown
                                  className={`ml-1 h-4 w-4 ${sortConfig.direction === "desc"
                                    ? "rotate-180"
                                    : ""
                                    }`}
                                />
                              )}
                            </div>
                          </TableHead>
                        ))}
                        <TableHead className="text-right font-semibold text-slate-700">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedEntities.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={visibleColumns.length + 1}
                            className="text-center py-10 text-slate-500"
                          >
                            {emptyState ||
                              `No ${entityPlural} found matching your search criteria.`}
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedEntities.map((entity) => (
                          <TableRow
                            key={entity.id}
                            className="hover:bg-slate-50/50 border-slate-200"
                          >
                            {visibleColumns.map((column) => (
                              <TableCell
                                key={`${entity.id}-${column.key}`}
                                className={column.className || ""}
                              >
                                {column.render
                                  ? column.render(entity)
                                  : entity[column.key]}
                              </TableCell>
                            ))}
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48"
                                >
                                  <DropdownMenuItem
                                    onClick={() => openViewDialog(entity)}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="mr-2 h-4 w-4 text-slate-500" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleAcceptEntity(entity.id)}
                                    className="cursor-pointer"
                                  >
                                    <Check className="mr-2 h-4 w-4 text-slate-500" />
                                    Approve
                                  </DropdownMenuItem><DropdownMenuItem
                                    onClick={() => handleDeclineEntity(entity.id)}
                                    className="cursor-pointer"
                                  >
                                    <X className="mr-2 h-4 w-4 text-slate-500" />
                                    Decline
                                  </DropdownMenuItem>

                                  {updateEntity && (
                                    <DropdownMenuItem
                                      onClick={() => openEditDialog(entity)}
                                      className="cursor-pointer"
                                    >
                                      <Edit className="mr-2 h-4 w-4 text-slate-500" />
                                      Edit
                                    </DropdownMenuItem>
                                  )}
                                  {deleteEntity && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => openDeleteDialog(entity)}
                                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                      >
                                        <Trash className="mr-2 h-4 w-4" />
                                        Delete
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
                <div className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="h-8 px-3"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="h-8 px-3"
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardFooter>
            </div>
          </TabsContent>

          {enableTabs && (
            <>
              <TabsContent value="active" className="mt-0">
                {/* Content for active entities tab */}
                <div className="overflow-hidden border rounded-md">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-slate-50">
                          <TableRow className="hover:bg-slate-50 border-slate-200">
                            {visibleColumns.map((column) => (
                              <TableHead
                                key={column.key}
                                className={`font-semibold text-slate-700 ${column.sortable ? "cursor-pointer" : ""
                                  } ${column.className || ""}`}
                                onClick={() =>
                                  column.sortable && requestSort(column.key)
                                }
                              >
                                <div className="flex items-center">
                                  {column.label}
                                  {sortConfig.key === column.key && (
                                    <ChevronDown
                                      className={`ml-1 h-4 w-4 ${sortConfig.direction === "desc"
                                        ? "rotate-180"
                                        : ""
                                        }`}
                                    />
                                  )}
                                </div>
                              </TableHead>
                            ))}
                            <TableHead className="text-right font-semibold text-slate-700">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedEntities.filter(
                            (entity) => entity.status === "active"
                          ).length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={visibleColumns.length + 1}
                                className="text-center py-10 text-slate-500"
                              >
                                {emptyState ||
                                  `No active ${entityPlural} found.`}
                              </TableCell>
                            </TableRow>
                          ) : (
                            paginatedEntities
                              .filter((entity) => entity.status === "active")
                              .map((entity) => (
                                <TableRow
                                  key={entity.id}
                                  className="hover:bg-slate-50/50 border-slate-200"
                                >
                                  {visibleColumns.map((column) => (
                                    <TableCell
                                      key={`${entity.id}-${column.key}`}
                                      className={column.className || ""}
                                    >
                                      {column.render
                                        ? column.render(entity)
                                        : entity[column.key]}
                                    </TableCell>
                                  ))}
                                  <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                        >
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="w-48"
                                      >
                                        <DropdownMenuItem
                                          onClick={() => openViewDialog(entity)}
                                          className="cursor-pointer"
                                        >
                                          <Eye className="mr-2 h-4 w-4 text-slate-500" />
                                          View Details
                                        </DropdownMenuItem>
                                        {updateEntity && (
                                          <DropdownMenuItem
                                            onClick={() =>
                                              openEditDialog(entity)
                                            }
                                            className="cursor-pointer"
                                          >
                                            <Edit className="mr-2 h-4 w-4 text-slate-500" />
                                            Edit
                                          </DropdownMenuItem>
                                        )}
                                        {deleteEntity && (
                                          <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                              onClick={() =>
                                                openDeleteDialog(entity)
                                              }
                                              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                            >
                                              <Trash className="mr-2 h-4 w-4" />
                                              Delete
                                            </DropdownMenuItem>
                                          </>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </div>
              </TabsContent>

              <TabsContent value="pending" className="mt-0">
                {/* Content for pending entities tab */}
                <div className="overflow-hidden border rounded-md">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-slate-50">
                          <TableRow className="hover:bg-slate-50 border-slate-200">
                            {visibleColumns.map((column) => (
                              <TableHead
                                key={column.key}
                                className={`font-semibold text-slate-700 ${column.sortable ? "cursor-pointer" : ""
                                  } ${column.className || ""}`}
                                onClick={() =>
                                  column.sortable && requestSort(column.key)
                                }
                              >
                                <div className="flex items-center">
                                  {column.label}
                                  {sortConfig.key === column.key && (
                                    <ChevronDown
                                      className={`ml-1 h-4 w-4 ${sortConfig.direction === "desc"
                                        ? "rotate-180"
                                        : ""
                                        }`}
                                    />
                                  )}
                                </div>
                              </TableHead>
                            ))}
                            <TableHead className="text-right font-semibold text-slate-700">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedEntities.filter(
                            (entity) => entity.status === "pending"
                          ).length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={visibleColumns.length + 1}
                                className="text-center py-10 text-slate-500"
                              >
                                {emptyState ||
                                  `No pending ${entityPlural} found.`}
                              </TableCell>
                            </TableRow>
                          ) : (
                            paginatedEntities
                              .filter((entity) => entity.status === "pending")
                              .map((entity) => (
                                <TableRow
                                  key={entity.id}
                                  className="hover:bg-slate-50/50 border-slate-200"
                                >
                                  {visibleColumns.map((column) => (
                                    <TableCell
                                      key={`${entity.id}-${column.key}`}
                                      className={column.className || ""}
                                    >
                                      {column.render
                                        ? column.render(entity)
                                        : entity[column.key]}
                                    </TableCell>
                                  ))}
                                  <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                        >
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="w-48"
                                      >
                                        <DropdownMenuItem
                                          onClick={() => openViewDialog(entity)}
                                          className="cursor-pointer"
                                        >
                                          <Eye className="mr-2 h-4 w-4 text-slate-500" />
                                          View Details
                                        </DropdownMenuItem>
                                        {updateEntity && (
                                          <DropdownMenuItem
                                            onClick={() =>
                                              openEditDialog(entity)
                                            }
                                            className="cursor-pointer"
                                          >
                                            <Edit className="mr-2 h-4 w-4 text-slate-500" />
                                            Edit
                                          </DropdownMenuItem>
                                        )}
                                        {deleteEntity && (
                                          <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                              onClick={() =>
                                                openDeleteDialog(entity)
                                              }
                                              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                            >
                                              <Trash className="mr-2 h-4 w-4" />
                                              Delete
                                            </DropdownMenuItem>
                                          </>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </div>
              </TabsContent>

              <TabsContent value="inactive" className="mt-0">
                {/* Content for inactive entities tab */}
                <div className="overflow-hidden border rounded-md">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-slate-50">
                          <TableRow className="hover:bg-slate-50 border-slate-200">
                            {visibleColumns.map((column) => (
                              <TableHead
                                key={column.key}
                                className={`font-semibold text-slate-700 ${column.sortable ? "cursor-pointer" : ""
                                  } ${column.className || ""}`}
                                onClick={() =>
                                  column.sortable && requestSort(column.key)
                                }
                              >
                                <div className="flex items-center">
                                  {column.label}
                                  {sortConfig.key === column.key && (
                                    <ChevronDown
                                      className={`ml-1 h-4 w-4 ${sortConfig.direction === "desc"
                                        ? "rotate-180"
                                        : ""
                                        }`}
                                    />
                                  )}
                                </div>
                              </TableHead>
                            ))}
                            <TableHead className="text-right font-semibold text-slate-700">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedEntities.filter(
                            (entity) => entity.status === "inactive"
                          ).length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={visibleColumns.length + 1}
                                className="text-center py-10 text-slate-500"
                              >
                                {emptyState ||
                                  `No inactive ${entityPlural} found.`}
                              </TableCell>
                            </TableRow>
                          ) : (
                            paginatedEntities
                              .filter((entity) => entity.status === "inactive")
                              .map((entity) => (
                                <TableRow
                                  key={entity.id}
                                  className="hover:bg-slate-50/50 border-slate-200"
                                >
                                  {visibleColumns.map((column) => (
                                    <TableCell
                                      key={`${entity.id}-${column.key}`}
                                      className={column.className || ""}
                                    >
                                      {column.render
                                        ? column.render(entity)
                                        : entity[column.key]}
                                    </TableCell>
                                  ))}
                                  <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                        >
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="w-48"
                                      >
                                        <DropdownMenuItem
                                          onClick={() => openViewDialog(entity)}
                                          className="cursor-pointer"
                                        >
                                          <Eye className="mr-2 h-4 w-4 text-slate-500" />
                                          View Details
                                        </DropdownMenuItem>
                                        {updateEntity && (
                                          <DropdownMenuItem
                                            onClick={() =>
                                              openEditDialog(entity)
                                            }
                                            className="cursor-pointer"
                                          >
                                            <Edit className="mr-2 h-4 w-4 text-slate-500" />
                                            Edit
                                          </DropdownMenuItem>
                                        )}
                                        {deleteEntity && (
                                          <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                              onClick={() =>
                                                openDeleteDialog(entity)
                                              }
                                              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                            >
                                              <Trash className="mr-2 h-4 w-4" />
                                              Delete
                                            </DropdownMenuItem>
                                          </>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </div>
              </TabsContent>
            </>
          )}

          {/* Additional tabs */}
          {additionalTabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Add Activity Dialog */}
      {addEntity && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New Property</DialogTitle>
              <DialogDescription>
                Add a new property for your platform
              </DialogDescription>
            </DialogHeader>
            {createForm ? (
              React.cloneElement(createForm, {
                formData,
                setFormData,
                onSubmit: handleAddEntity,
                onCancel: () => setIsAddDialogOpen(false),
                isLoading: addMutation.isPending,
              })
            ) : (
              <form onSubmit={handleAddEntity}>
                <ScrollArea className="pr-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="propertyType">Property Type</Label>
                        <Select
                          value={formData.propertyType}
                          onValueChange={(value) =>
                            setFormData({ ...formData, propertyType: value })
                          }
                        >
                          <SelectTrigger className="border-slate-300 w-full">
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="villa">Villa</SelectItem>
                            <SelectItem value="hotel">Hotel</SelectItem>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            {/* Add other property types as needed */}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="name">Property Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter property name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="unitType">Unit Type</Label>
                        <Select
                          value={formData.unitType}
                          onValueChange={(value) =>
                            setFormData({ ...formData, unitType: value })
                          }
                        >
                          <SelectTrigger className="border-slate-300 w-full">
                            <SelectValue placeholder="Select unit type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entire_home">Entire Home</SelectItem>
                            <SelectItem value="private_room">Private Room</SelectItem>
                            <SelectItem value="shared_room">Shared Room</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="maxGuests">Max Guests</Label>
                        <Input
                          id="maxGuests"
                          name="maxGuests"
                          type="number"
                          min="1"
                          value={formData.maxGuests}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="bedroomCount">Bedrooms</Label>
                        <Input
                          id="bedroomCount"
                          name="bedroomCount"
                          type="number"
                          min="1"
                          value={formData.bedroomCount}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="bathroomCount">Total Bathrooms</Label>
                        <Input
                          id="bathroomCount"
                          name="bathroomCount"
                          type="number"
                          min="1"
                          value={formData.bathroomCount}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="attachedBathrooms">Attached Bathrooms</Label>
                        <Input
                          id="attachedBathrooms"
                          name="attachedBathrooms"
                          type="number"
                          min="0"
                          value={formData.attachedBathrooms}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="sharedBathrooms">Shared Bathrooms</Label>
                        <Input
                          id="sharedBathrooms"
                          name="sharedBathrooms"
                          type="number"
                          min="0"
                          value={formData.sharedBathrooms}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="maxChildren">Max Children</Label>
                        <Input
                          id="maxChildren"
                          name="maxChildren"
                          type="number"
                          min="0"
                          value={formData.maxChildren}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="maxInfants">Max Infants</Label>
                        <Input
                          id="maxInfants"
                          name="maxInfants"
                          type="number"
                          min="0"
                          value={formData.maxInfants}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="bathroomType">Bathroom Type</Label>
                        <Select
                          value={formData.bathroomType}
                          onValueChange={(value) =>
                            setFormData({ ...formData, bathroomType: value })
                          }
                        >
                          <SelectTrigger className="border-slate-300 w-full">
                            <SelectValue placeholder="Select bathroom type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="shared">Shared</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="floorNumber">Floor Number</Label>
                        <Input
                          id="floorNumber"
                          name="floorNumber"
                          type="number"
                          value={formData.floorNumber || ''}
                          onChange={handleInputChange}
                          placeholder="Ground floor if empty"
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="size">Size (sq ft)</Label>
                        <Input
                          id="size"
                          name="size"
                          type="number"
                          value={formData.size || ''}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="minimumStay">Minimum Stay (nights)</Label>
                        <Input
                          id="minimumStay"
                          name="minimumStay"
                          type="number"
                          min="1"
                          value={formData.minimumStay}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="hasKitchen"
                          checked={formData.hasKitchen}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, hasKitchen: checked })
                          }
                        />
                        <Label htmlFor="hasKitchen">Has Kitchen</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="hasLivingRoom"
                          checked={formData.hasLivingRoom}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, hasLivingRoom: checked })
                          }
                        />
                        <Label htmlFor="hasLivingRoom">Has Living Room</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="hasDiningArea"
                          checked={formData.hasDiningArea}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, hasDiningArea: checked })
                          }
                        />
                        <Label htmlFor="hasDiningArea">Has Dining Area</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="hasBalcony"
                          checked={formData.hasBalcony}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, hasBalcony: checked })
                          }
                        />
                        <Label htmlFor="hasBalcony">Has Balcony</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="hasGarden"
                          checked={formData.hasGarden}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, hasGarden: checked })
                          }
                        />
                        <Label htmlFor="hasGarden">Has Garden</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="hasPoolAccess"
                          checked={formData.hasPoolAccess}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, hasPoolAccess: checked })
                          }
                        />
                        <Label htmlFor="hasPoolAccess">Has Pool Access</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="hasHotWater"
                          checked={formData.hasHotWater}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, hasHotWater: checked })
                          }
                        />
                        <Label htmlFor="hasHotWater">Has Hot Water</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="smokingAllowed"
                          checked={formData.smokingAllowed}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, smokingAllowed: checked })
                          }
                        />
                        <Label htmlFor="smokingAllowed">Smoking Allowed</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="petsAllowed"
                          checked={formData.petsAllowed}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, petsAllowed: checked })
                          }
                        />
                        <Label htmlFor="petsAllowed">Pets Allowed</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="eventsAllowed"
                          checked={formData.eventsAllowed}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, eventsAllowed: checked })
                          }
                        />
                        <Label htmlFor="eventsAllowed">Events Allowed</Label>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="kitchenType">Kitchen Type</Label>
                        <Select
                          value={formData.kitchenType}
                          onValueChange={(value) =>
                            setFormData({ ...formData, kitchenType: value })
                          }
                        >
                          <SelectTrigger className="border-slate-300 w-full">
                            <SelectValue placeholder="Select kitchen type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full">Full Kitchen</SelectItem>
                            <SelectItem value="partial">Partial Kitchen</SelectItem>
                            <SelectItem value="none">No Kitchen</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                        <Select
                          value={formData.cancellationPolicy}
                          onValueChange={(value) =>
                            setFormData({ ...formData, cancellationPolicy: value })
                          }
                        >
                          <SelectTrigger className="border-slate-300 w-full">
                            <SelectValue placeholder="Select cancellation policy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flexible">Flexible</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="strict">Strict</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="basePrice">Base Price (LKR)</Label>
                        <Input
                          id="basePrice"
                          name="basePrice"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.basePrice}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cleaningFee">Cleaning Fee (LKR)</Label>
                        <Input
                          id="cleaningFee"
                          name="cleaningFee"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.cleaningFee}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="securityDeposit">Security Deposit (LKR)</Label>
                        <Input
                          id="securityDeposit"
                          name="securityDeposit"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.securityDeposit}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="extraGuestFee">Extra Guest Fee (LKR)</Label>
                        <Input
                          id="extraGuestFee"
                          name="extraGuestFee"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.extraGuestFee}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                    </div>

                    {/* Location Fields */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          placeholder="Enter city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="district">District</Label>
                        <Input
                          id="district"
                          name="district"
                          placeholder="Enter district"
                          value={formData.district}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="province">Province</Label>
                        <Input
                          id="province"
                          name="province"
                          placeholder="Enter province"
                          value={formData.province}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address">Full Address</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="Enter full address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="border-slate-300"
                          disabled
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          placeholder="Enter postal code"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Contact Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Contact Email</Label>
                        <Input
                          id="email"
                          name="email"
                          placeholder="Enter email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="website">Website (optional)</Label>
                      <Input
                        id="website"
                        name="website"
                        placeholder="Enter website URL"
                        type="url"
                        value={formData.website || ""}
                        onChange={handleInputChange}
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          name="latitude"
                          placeholder="Enter latitude"
                          value={formData.latitude}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          name="longitude"
                          placeholder="Enter longitude"
                          value={formData.longitude}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="checkInTime">Check-in Time</Label>
                        <Input
                          id="checkInTime"
                          name="checkInTime"
                          type="time"
                          value={formData.checkInTime}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="checkOutTime">Check-out Time</Label>
                        <Input
                          id="checkOutTime"
                          name="checkOutTime"
                          type="time"
                          value={formData.checkOutTime}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Enter property description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="flex h-20 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="vistaVerified">Verification Status</Label>
                        <Select
                          value={formData.vistaVerified ? "true" : "false"}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              vistaVerified: value === "true",
                            })
                          }
                        >
                          <SelectTrigger className="border-slate-300 w-full">
                            <SelectValue placeholder="Select verification status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Verified</SelectItem>
                            <SelectItem value="false">Not Verified</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="isActive">Listing Status</Label>
                        <Select
                          value={formData.isActive ? "true" : "false"}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              isActive: value === "true",
                            })
                          }
                        >
                          <SelectTrigger className="border-slate-300 w-full">
                            <SelectValue placeholder="Select listing status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="images" className="text-slate-700">
                        Images
                      </Label>
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-2">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`Property ${index}`}
                                className="h-20 w-20 object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                              >
                                <X className="h-3 w-3 text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <input
                          type="file"
                          id="images"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          multiple
                          accept="image/*"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImages}
                        >
                          {uploadingImages ? (
                            "Uploading..."
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Images
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Amenities</Label>
                      <div className="flex gap-4 mt-3 flex-wrap">
                        {fetchedAmanities.map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox
                              id={item.name}
                              checked={formData.amenities.includes(item.id)}
                              onCheckedChange={() => handleCheckChange(item.id)}
                            />
                            <label
                              htmlFor={item.name}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {item.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={addMutation.isPending}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {addMutation.isPending ? "Adding..." : "Add Property"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Activity Dialog */}
      {updateEntity && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Edit Activity</DialogTitle>
              <DialogDescription>Update activity information</DialogDescription>
            </DialogHeader>
            {editForm ? (
              React.cloneElement(editForm, {
                formData,
                setFormData,
                onSubmit: handleUpdateEntity,
                onCancel: () => setIsEditDialogOpen(false),
                isLoading: updateMutation.isPending,
              })
            ) : (
              <form onSubmit={handleUpdateEntity}>
                <ScrollArea className="pr-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="propertyType">Property Type</Label>
                        <Select
                          value={formData.propertyType}
                          onValueChange={(value) =>
                            setFormData({ ...formData, propertyType: value })
                          }
                        >
                          <SelectTrigger className="border-slate-300 w-full">
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hotel">
                              <div className="flex items-center">
                                <Hotel className="h-4 w-4 mr-2" /> Hotel
                              </div>
                            </SelectItem>
                            <SelectItem value="apartment">
                              <div className="flex items-center">
                                <Home className="h-4 w-4 mr-2" /> Apartment
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="title">Property Name</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="Enter property name"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          className="border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          placeholder="Enter city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="district">District</Label>
                        <Input
                          id="district"
                          name="district"
                          placeholder="Enter district"
                          value={formData.district}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="province">Province</Label>
                        <Input
                          id="province"
                          name="province"
                          placeholder="Enter province"
                          value={formData.province}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address">Full Address</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="Enter full address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Contact Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Contact Email</Label>
                        <Input
                          id="email"
                          name="email"
                          placeholder="Enter email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="website">Website (optional)</Label>
                      <Input
                        id="website"
                        name="website"
                        placeholder="Enter website URL"
                        type="url"
                        value={formData.website || ""}
                        onChange={handleInputChange}
                        className="border-slate-300"
                      />
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="latitude">latitude</Label>
                        <Input
                          id="latitude"
                          name="latitude"
                          placeholder="Enter latitude"
                          value={formData.latitude}
                          onChange={handleInputChange}
                          required
                          className="border-slate-300"
                        />
                      </div>


                      <div className="grid gap-2">
                        <Label htmlFor="longitude">longitude</Label>
                        <Input
                          id="longitude"
                          name="longitude"
                          placeholder="Enter longitude"
                          value={formData.longitude}
                          onChange={handleInputChange}
                          required
                          className="border-slate-300"
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="checkInTime">Check-in Time</Label>
                        <Input
                          id="checkInTime"
                          name="checkInTime"
                          type="time"
                          value={formData.checkInTime}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="checkOutTime">Check-out Time</Label>
                        <Input
                          id="checkOutTime"
                          name="checkOutTime"
                          type="time"
                          value={formData.checkOutTime}
                          onChange={handleInputChange}
                          className="border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Enter property description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="flex h-20 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="vistaVerified">Verification Status</Label>
                        <Select
                          value={formData.vistaVerified ? "true" : "false"}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              vistaVerified: value === "true",
                            })
                          }
                        >
                          <SelectTrigger className="border-slate-300 w-full">
                            <SelectValue placeholder="Select verification status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Verified</SelectItem>
                            <SelectItem value="false">Not Verified</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="isActive">Listing Status</Label>
                        <Select
                          value={formData.isActive ? "true" : "false"}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              isActive: value === "true",
                            })
                          }
                        >
                          <SelectTrigger className="border-slate-300 w-full">
                            <SelectValue placeholder="Select listing status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="images" className="text-slate-700">
                        Images
                      </Label>
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-2">
                          {currentEntity?.images?.map((image, index) => (
                            <div key={index} className="relative h-20 w-20">
                              <Image
                                src={image.imageUrl}
                                alt={`Property ${index}`}
                                fill
                                className="object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                              >
                                <X className="h-3 w-3 text-white" />
                              </button>
                            </div>
                          ))}
                          {formData.images.map((image, index) => (
                            <div key={`new-${index}`} className="relative h-20 w-20">
                              <img
                                src={image}
                                alt={`New image ${index}`}
                                className="h-full w-full object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                              >
                                <X className="h-3 w-3 text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <input
                          type="file"
                          id="images"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          multiple
                          accept="image/*"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImages}
                        >
                          {uploadingImages ? (
                            "Uploading..."
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Images
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      Amanities
                      <div className="flex gap-4 mt-3">
                        {fetchedAmanities.map((item, index) => {
                          return (
                            <div
                              checked={formData.amenities.includes(item.id)}
                              onChange={() => handleCheckChange(item.id)}
                              id={index} className="flex items-center space-x-2">
                              <Checkbox id={item.name} />
                              <label
                                htmlFor={item.name}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {item.name}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={addMutation.isPending}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {updateMutation.isPending ? "Updating..." : "Update Property"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* View Property Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {currentEntity?.title} Details
            </DialogTitle>
          </DialogHeader>
          {currentEntity && (
            <ScrollArea className="max-h-[70vh]">
              {viewDetails ? (
                viewDetails(currentEntity)
              ) : (
                <div className="p-2">
                  <div className="flex flex-col items-center pb-4 mb-4 border-b border-slate-200">
                    <Avatar className="h-20 w-20 mb-3">
                      <AvatarImage
                        src={currentEntity.images?.[0]?.imageUrl}
                        alt={currentEntity.title}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                        {currentEntity.propertyType === "hotel" ? (
                          <Hotel className="h-6 w-6" />
                        ) : (
                          <Home className="h-6 w-6" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-slate-800">
                      {currentEntity.title}
                    </h3>
                    <p className="text-slate-500 capitalize">
                      {currentEntity.propertyType} • {currentEntity.district}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-1">
                          <MapPin className="inline h-4 w-4 mr-1 text-slate-400" />
                          Location
                        </h4>
                        <p className="text-slate-600">
                          {currentEntity.city}, {currentEntity.district}
                          <br />
                          {currentEntity.address}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-1">
                          <Calendar className="inline h-4 w-4 mr-1 text-slate-400" />
                          Check-in/out
                        </h4>
                        <p className="text-slate-600">
                          {currentEntity.checkInTime} / {currentEntity.checkOutTime}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-1">
                          <Phone className="inline h-4 w-4 mr-1 text-slate-400" />
                          Contact
                        </h4>
                        <p className="text-slate-600">
                          {currentEntity.phone || "Not provided"}
                          <br />
                          {currentEntity.email || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-1">
                          <Globe className="inline h-4 w-4 mr-1 text-slate-400" />
                          Website
                        </h4>
                        <p className="text-slate-600">
                          {currentEntity.website || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-1">
                        Status
                      </h4>
                      <div className="flex gap-2">
                        <Badge variant={currentEntity.isActive ? "default" : "outline"}>
                          {currentEntity.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant={currentEntity.vistaVerified ? "default" : "outline"}>
                          {currentEntity.vistaVerified ? "Verified" : "Unverified"}
                        </Badge>
                        <Badge variant={
                          currentEntity.approvalStatus === "approved" ? "default" :
                            currentEntity.approvalStatus === "pending" ? "secondary" : "destructive"
                        }>
                          {currentEntity.approvalStatus || "Pending"}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-1">
                        Description
                      </h4>
                      <p className="text-slate-600 whitespace-pre-line">
                        {currentEntity.description || "No description provided"}
                      </p>
                    </div>

                    {currentEntity.amenities?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-1">
                          Amenities
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {currentEntity.amenities
                            .filter(a => a.PropertyAmenity.isAvailable)
                            .map((amenity) => (
                              <Badge key={amenity.id} variant="outline">
                                {amenity.name}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </ScrollArea>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            {updateEntity && (
              <Button
                variant="outline"
                onClick={() => currentEntity && openEditDialog(currentEntity)}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            )}
            <Button
              onClick={() => setIsViewDialogOpen(false)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {deleteEntity && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-red-600">
                Delete Property
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="flex items-center p-4 mb-4 bg-red-50 text-red-800 rounded-md">
                <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">
                    Are you sure you want to delete this property?
                  </p>
                  <p className="mt-1 text-sm text-red-700">
                    Deleting{" "}
                    <span className="font-semibold">
                      {currentEntity?.title}
                    </span>{" "}
                    will remove all its data from your platform.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteEntity}
                disabled={deleteMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Property"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
