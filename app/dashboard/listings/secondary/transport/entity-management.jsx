// components/entity-management.tsx
import { useState, useRef, useEffect } from "react";
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
  Image as ImageIcon,
  X,
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { exportToExcel } from "@/lib/utils";
import axios from "axios";
import { MultiSelect } from "@/components/multi-select";
import { uploadImagesToS3 } from "@/lib/s3BucketUploader";
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

// const transportTypes = [
//   { id: "1", name: "Bus" },
//   { id: "2", name: "Train" },
//   { id: "3", name: "Taxi" },
//   { id: "4", name: "Private Car" },
//   { id: "5", name: "Shuttle" },
//   { id: "6", name: "Ferry" },
//   { id: "7", name: "Airplane" },
// ];

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
  addButtonLabel = `Add New ${
    entityName.charAt(0).toUpperCase() + entityName.slice(1)
  }`,
  emptyState,
  createForm,
  editForm,
  viewDetails,
  statusfilterenabled = false,
  initialFormData = {
    id: "",
    title: "",
    images: [],
    transportTypeId: "",
    vistaVerified: false,
    operatorName: "",
    pricePerKmUSD: "",
    amenities: "",
    reviews: {
      vistaReview: {
        rating: null,
        text: "",
      },
      travelerReviews: [],
    },
    phone: "",
    email: "",
    website: "",
    description: "",
    departureCity: "",
    arrivalCity: "",
    latitude: null,
    longitude: null,
    onlineImages: [],
    seatCount: null,
    transportType: {
      id: null,
      language_code: "",
      name: "",
      isActive: null,
    },
    type: "Transport",
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
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [FetchedAmenities, setFetchedAmenities] = useState([]);
  const [FetchedTransportTypes, setFetchedTransportTypes] = useState([]);

  const datafromlocalstorage = JSON.parse(localStorage.getItem("user"));
  console.log(datafromlocalstorage.data.accessToken);

  useEffect(() => {
    const fetchAmenities = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/amenities`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setFetchedAmenities(response.data.data);
    };

    const fetchTravelTypes = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/transport-types`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${datafromlocalstorage.data.accessToken}`,
          },
          withCredentials: true,
        }
      );

      setFetchedTransportTypes(response.data.data);
    };

    fetchAmenities();
    fetchTravelTypes();
  }, []);

  const queryClient = useQueryClient();

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
        `${
          entityName.charAt(0).toUpperCase() + entityName.slice(1)
        } added successfully`,
        {
          description: `${
            newEntity.name || newEntity.title
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
        description: `${
          updatedEntity.name || updatedEntity.title
        }'s information has been updated.`,
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to update ${entityName}`, {
        description:
          error.message ||
          `There was an error updating the ${entityName}. Please try again.`,
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
        description:
          error.message ||
          `There was an error deleting the ${entityName}. Please try again.`,
      });
    },
  });

  // Filter and sort entities
  const filteredEntities = entities.filter((entity) => {
    const matchesSearch =
      entity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entity.country &&
        entity.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (entity.city &&
        entity.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      Object.keys(entity).some(
        (key) =>
          typeof entity[key] === "string" &&
          entity[key].toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || entity.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort entities
  const sortedEntities = [...filteredEntities].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle undefined/null values
    if (aValue === undefined || aValue === null) aValue = "";
    if (bValue === undefined || bValue === null) bValue = "";

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

    // Split by dot to handle nested updates
    const keys = name.split(".");
    if (keys.length === 1) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => {
        const newData = { ...prev };
        let temp = newData;

        for (let i = 0; i < keys.length - 1; i++) {
          if (!temp[keys[i]]) temp[keys[i]] = {};
          temp[keys[i]] = { ...temp[keys[i]] };
          temp = temp[keys[i]];
        }

        temp[keys[keys.length - 1]] = value;
        return newData;
      });
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEntity = async (e) => {
    e.preventDefault();

    const newformdata = new FormData();
    newformdata.append("title", formData.title);
    newformdata.append("transportTypeId", formData.transportTypeId);
    newformdata.append("arrivalCity", formData.arrivalCity);
    newformdata.append("departureCity", formData.departureCity);
    newformdata.append("description", formData.description);
    newformdata.append("email", formData.email);
    newformdata.append("latitude", formData.latitude);
    newformdata.append("longitude", formData.longitude);
    newformdata.append("operatorName", formData.operatorName);
    newformdata.append("pricePerKmUSD", formData.pricePerKmUSD);
    // newformdata.append("vistaVerified", formData.vistaVerified);
    newformdata.append("website", formData.website);
    newformdata.append("phone", formData.phone);
    newformdata.append("seatCount", formData.seatCount);
    newformdata.append("amenities", formData.amenities);

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

  const handleUpdateEntity = (e) => {
    e.preventDefault();
    if (updateEntity && currentEntity) {
      updateMutation.mutate({ ...currentEntity, ...formData });
    }
  };

  const handleDeleteEntity = () => {
    if (deleteEntity && currentEntity) {
      deleteMutation.mutate(currentEntity.id);
    }
  };

  const openEditDialog = (entity) => {
    setCurrentEntity(entity);
    setFormData({
      ...initialFormData,
      ...entity,
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

  const getTransportTypeName = (id) => {
    return (
      FetchedTransportTypes.find((type) => type.id === id)?.name || "Unknown"
    );
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
    <div className="container mx-auto py-8 px-4 max-w-full">
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
                  className={`${
                    enableSearch
                      ? "md:col-span-6 lg:col-span-7"
                      : "md:col-span-12"
                  } flex flex-wrap justify-start md:justify-end gap-2`}
                >
                  {enableFilters && (
                    <>
                      {statusfilterenabled && (
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
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Button
                            variant="outline"
                            className="border-slate-300"
                          >
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            More Filters
                          </Button>
                        </>
                      )}
                    </>
                  )}

                  {customFilters}

                  {enableExport && (
                    <Button
                      variant="outline"
                      className="border-slate-300"
                      onClick={() => exportToExcel(entities, "Transport")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Entity Listing Table */}
            <div className="overflow-hidden border rounded-md w-full">
              <CardContent className="p-0 w-full ">
                <div className="overflow-x-auto w-full">
                  <Table className="w-full">
                    <TableHeader className="bg-slate-50">
                      <TableRow className="hover:bg-slate-50 border-slate-200">
                        {visibleColumns.map((column) => (
                          <TableHead
                            key={column.key}
                            className={`font-semibold text-slate-700 ${
                              column.sortable ? "cursor-pointer" : ""
                            } ${column.className || ""}`}
                            onClick={() =>
                              column.sortable && requestSort(column.key)
                            }
                          >
                            <div className="flex items-center">
                              {column.label}
                              {sortConfig.key === column.key && (
                                <ChevronDown
                                  className={`ml-1 h-4 w-4 ${
                                    sortConfig.direction === "desc"
                                      ? "rotate-180 duration"
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
                                  : typeof entity[column.key] === "object"
                                  ? JSON.stringify(entity[column.key]) // Fallback for objects
                                  : entity[column.key] || "-"}
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
                                className={`font-semibold text-slate-700 ${
                                  column.sortable ? "cursor-pointer" : ""
                                } ${column.className || ""}`}
                                onClick={() =>
                                  column.sortable && requestSort(column.key)
                                }
                              >
                                <div className="flex items-center">
                                  {column.label}
                                  {sortConfig.key === column.key && (
                                    <ChevronDown
                                      className={`ml-1 h-4 w-4 ${
                                        sortConfig.direction === "desc"
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
                                        : entity[column.key] || "-"}
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
                                className={`font-semibold text-slate-700 ${
                                  column.sortable ? "cursor-pointer" : ""
                                } ${column.className || ""}`}
                                onClick={() =>
                                  column.sortable && requestSort(column.key)
                                }
                              >
                                <div className="flex items-center">
                                  {column.label}
                                  {sortConfig.key === column.key && (
                                    <ChevronDown
                                      className={`ml-1 h-4 w-4 ${
                                        sortConfig.direction === "desc"
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
                                        : entity[column.key] || "-"}
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
                                className={`font-semibold text-slate-700 ${
                                  column.sortable ? "cursor-pointer" : ""
                                } ${column.className || ""}`}
                                onClick={() =>
                                  column.sortable && requestSort(column.key)
                                }
                              >
                                <div className="flex items-center">
                                  {column.label}
                                  {sortConfig.key === column.key && (
                                    <ChevronDown
                                      className={`ml-1 h-4 w-4 ${
                                        sortConfig.direction === "desc"
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
                                        : entity[column.key] || "-"}
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

      {/* Add Transport Dialog */}
      {addEntity && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New Transport</DialogTitle>
              <DialogDescription>
                Create a new transport service for your platform
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title" className="text-slate-700">
                        Transport Title*
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Enter transport title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2 ">
                      <Label
                        htmlFor="transportTypeId"
                        className="text-slate-700"
                      >
                        Transport Type*
                      </Label>
                      <Select
                        value={formData.transportTypeId?.toString() || ""}
                        onValueChange={(value) => {
                          setFormData({
                            ...formData,
                            transportTypeId: Number(value), // storing the ID
                          });
                        }}
                        required
                      >
                        <SelectTrigger className="border-slate-300 w-full">
                          <SelectValue placeholder="Select transport type">
                            {FetchedTransportTypes.find(
                              (item) => item.id === formData.transportTypeId
                            )?.name || "Select transport type"}
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                          {FetchedTransportTypes.map((type) => (
                            <SelectItem
                              key={type.id}
                              value={type.id.toString()}
                            >
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="operatorName" className="text-slate-700">
                        Operator Name*
                      </Label>
                      <Input
                        id="operatorName"
                        name="operatorName"
                        placeholder="Enter operator name"
                        value={formData.operatorName}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="transportTypeId"
                        className="text-slate-700"
                      >
                        Amenities
                      </Label>
                      <MultiSelect
                        options={FetchedAmenities}
                        onValueChange={(selectedItems) => {
                          // selectedItems should be an array of the currently selected amenity IDs
                          setFormData((prev) => ({
                            ...prev,
                            amenities: selectedItems, // This replaces the entire amenities array
                          }));
                        }}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="pricePerKmUSD" className="text-slate-700">
                        Price per Kilometer (USD)*
                      </Label>
                      <Input
                        id="pricePerKmUSD"
                        name="pricePerKmUSD"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter price per km"
                        value={formData.pricePerKmUSD}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
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
                                alt={`Transport ${index}`}
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
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="departureCity" className="text-slate-700">
                        Departure City*
                      </Label>
                      <Input
                        id="departureCity"
                        name="departureCity"
                        placeholder="Enter departure city"
                        value={formData.departureCity || ""}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="arrivalCity" className="text-slate-700">
                        Arrival City*
                      </Label>
                      <Input
                        id="arrivalCity"
                        name="arrivalCity"
                        placeholder="Enter arrival city"
                        value={formData.arrivalCity || ""}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2 ">
                      <Label htmlFor="vistaVerified" className="text-slate-700">
                        Vista Verified
                      </Label>
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
                      <Label htmlFor="description" className="text-slate-700">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Enter transport description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="border-slate-300"
                        rows={3}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="pricePerKmUSD" className="text-slate-700">
                        Seat Count*
                      </Label>
                      <Input
                        id="seatCount"
                        name="seatCount"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Enter Number of seats"
                        value={formData.seatCount}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities Section */}
                {/* <div className="border-t border-slate-200 pt-4 mt-4">
                  <h3 className="text-lg font-medium text-slate-800 mb-4">
                    Amenities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="airConditioned"
                        checked={
                          formData.amenities?.find(
                            (a) => a.type === "Air Conditioned"
                          )?.available || false
                        }
                        onCheckedChange={(checked) => {
                          const amenities = [...(formData.amenities || [])];
                          const index = amenities.findIndex(
                            (a) => a.type === "Air Conditioned"
                          );
                          if (index >= 0) {
                            amenities[index].available = checked;
                          } else {
                            amenities.push({
                              type: "Air Conditioned",
                              available: checked,
                            });
                          }
                          setFormData({ ...formData, amenities });
                        }}
                      />
                      <Label htmlFor="airConditioned">Air Conditioned</Label>
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="passengerCapacity"
                        className="text-slate-700"
                      >
                        Passenger Capacity
                      </Label>
                      <Input
                        id="passengerCapacity"
                        type="number"
                        min="1"
                        placeholder="Enter capacity"
                        value={
                          formData.amenities?.find(
                            (a) => a.type === "Passenger Capacity"
                          )?.value || ""
                        }
                        onChange={(e) => {
                          const amenities = [...(formData.amenities || [])];
                          const index = amenities.findIndex(
                            (a) => a.type === "Passenger Capacity"
                          );
                          if (index >= 0) {
                            amenities[index].value = e.target.value;
                          } else {
                            amenities.push({
                              type: "Passenger Capacity",
                              value: e.target.value,
                            });
                          }
                          setFormData({ ...formData, amenities });
                        }}
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="luggageSpace" className="text-slate-700">
                        Luggage Space (bags)
                      </Label>
                      <Input
                        id="luggageSpace"
                        type="number"
                        min="0"
                        placeholder="Enter luggage capacity"
                        value={
                          formData.amenities?.find(
                            (a) => a.type === "Luggage Space"
                          )?.value || ""
                        }
                        onChange={(e) => {
                          const amenities = [...(formData.amenities || [])];
                          const index = amenities.findIndex(
                            (a) => a.type === "Luggage Space"
                          );
                          if (index >= 0) {
                            amenities[index].value = e.target.value;
                          } else {
                            amenities.push({
                              type: "Luggage Space",
                              value: e.target.value,
                            });
                          }
                          setFormData({ ...formData, amenities });
                        }}
                        className="border-slate-300"
                      />
                    </div>
                  </div>
                </div> */}

                {/* Contact Details Section */}
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <h3 className="text-lg font-medium text-slate-800 mb-4">
                    Contact Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="contactPhone" className="text-slate-700">
                        Phone Number
                      </Label>
                      <Input
                        id="contactPhone"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone || ""}
                        onChange={handleInputChange}
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="contactEmail" className="text-slate-700">
                        Email
                      </Label>
                      <Input
                        id="contactEmail"
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        value={formData.email || ""}
                        onChange={handleInputChange}
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="contactWebsite"
                        className="text-slate-700"
                      >
                        Website
                      </Label>
                      <Input
                        id="contactWebsite"
                        name="website"
                        type="url"
                        placeholder="Enter website URL"
                        value={formData.website || ""}
                        onChange={handleInputChange}
                        className="border-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Coordinates Section */}
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <h3 className="text-lg font-medium text-slate-800 mb-4">
                    Location Coordinates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="latitude" className="text-slate-700">
                        Latitude
                      </Label>
                      <Input
                        id="latitude"
                        name="latitude"
                        type="number"
                        step="any"
                        placeholder="Enter latitude"
                        value={formData.latitude || ""}
                        onChange={handleInputChange}
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="longitude" className="text-slate-700">
                        Longitude
                      </Label>
                      <Input
                        id="longitude"
                        name="longitude"
                        type="number"
                        step="any"
                        placeholder="Enter longitude"
                        value={formData.longitude || ""}
                        onChange={handleInputChange}
                        className="border-slate-300"
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={addMutation.isPending || uploadingImages}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {addMutation.isPending ? "Adding..." : "Add Transport"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Transport Dialog */}
      {updateEntity && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Edit Transport</DialogTitle>
              <DialogDescription>
                Update transport information
              </DialogDescription>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title" className="text-slate-700">
                        Transport Title*
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Enter transport title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2 ">
                      <Label
                        htmlFor="transportTypeId"
                        className="text-slate-700"
                      >
                        Transport Type*
                      </Label>
                      <Select
                        value={formData.transportTypeId?.toString() || ""}
                        onValueChange={(value) => {
                          setFormData({
                            ...formData,
                            transportTypeId: Number(value), // storing the ID
                          });
                        }}
                        required
                      >
                        <SelectTrigger className="border-slate-300 w-full">
                          <SelectValue placeholder="Select transport type">
                            {FetchedTransportTypes.find(
                              (item) => item.id === formData.transportTypeId
                            )?.name || "Select transport type"}
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                          {FetchedTransportTypes.map((type) => (
                            <SelectItem
                              key={type.id}
                              value={type.id.toString()}
                            >
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="operatorName" className="text-slate-700">
                        Operator Name*
                      </Label>
                      <Input
                        id="operatorName"
                        name="operatorName"
                        placeholder="Enter operator name"
                        value={formData.operatorName}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="transportTypeId"
                        className="text-slate-700"
                      >
                        Amenities
                      </Label>
                      <MultiSelect
                        // defaultValue={formData.amenities.map(
                        //   (amenity) => amenity.id
                        // )}
                        options={FetchedAmenities}
                        onValueChange={(selectedItems) => {
                          // selectedItems should be an array of the currently selected amenity IDs
                          setFormData((prev) => ({
                            ...prev,
                            amenities: selectedItems, // This replaces the entire amenities array
                          }));
                        }}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="pricePerKmUSD" className="text-slate-700">
                        Price per Kilometer (USD)*
                      </Label>
                      <Input
                        id="pricePerKmUSD"
                        name="pricePerKmUSD"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter price per km"
                        value={formData.pricePerKmUSD}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
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
                                src={image.imageUrl}
                                alt={`Transport ${index}`}
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
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="departureCity" className="text-slate-700">
                        Departure City*
                      </Label>
                      <Input
                        id="departureCity"
                        name="departureCity"
                        placeholder="Enter departure city"
                        value={formData.departureCity || ""}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="arrivalCity" className="text-slate-700">
                        Arrival City*
                      </Label>
                      <Input
                        id="arrivalCity"
                        name="arrivalCity"
                        placeholder="Enter arrival city"
                        value={formData.arrivalCity || ""}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2 ">
                      <Label htmlFor="vistaVerified" className="text-slate-700">
                        Vista Verified
                      </Label>
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
                      <Label htmlFor="description" className="text-slate-700">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Enter transport description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="border-slate-300"
                        rows={3}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="pricePerKmUSD" className="text-slate-700">
                        Seat Count*
                      </Label>
                      <Input
                        id="seatCount"
                        name="seatCount"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Enter Number of seats"
                        value={formData.seatCount}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities Section */}
                {/* <div className="border-t border-slate-200 pt-4 mt-4">
                  <h3 className="text-lg font-medium text-slate-800 mb-4">
                    Amenities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="airConditioned"
                        checked={
                          formData.amenities?.find(
                            (a) => a.type === "Air Conditioned"
                          )?.available || false
                        }
                        onCheckedChange={(checked) => {
                          const amenities = [...(formData.amenities || [])];
                          const index = amenities.findIndex(
                            (a) => a.type === "Air Conditioned"
                          );
                          if (index >= 0) {
                            amenities[index].available = checked;
                          } else {
                            amenities.push({
                              type: "Air Conditioned",
                              available: checked,
                            });
                          }
                          setFormData({ ...formData, amenities });
                        }}
                      />
                      <Label htmlFor="airConditioned">Air Conditioned</Label>
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="passengerCapacity"
                        className="text-slate-700"
                      >
                        Passenger Capacity
                      </Label>
                      <Input
                        id="passengerCapacity"
                        type="number"
                        min="1"
                        placeholder="Enter capacity"
                        value={
                          formData.amenities?.find(
                            (a) => a.type === "Passenger Capacity"
                          )?.value || ""
                        }
                        onChange={(e) => {
                          const amenities = [...(formData.amenities || [])];
                          const index = amenities.findIndex(
                            (a) => a.type === "Passenger Capacity"
                          );
                          if (index >= 0) {
                            amenities[index].value = e.target.value;
                          } else {
                            amenities.push({
                              type: "Passenger Capacity",
                              value: e.target.value,
                            });
                          }
                          setFormData({ ...formData, amenities });
                        }}
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="luggageSpace" className="text-slate-700">
                        Luggage Space (bags)
                      </Label>
                      <Input
                        id="luggageSpace"
                        type="number"
                        min="0"
                        placeholder="Enter luggage capacity"
                        value={
                          formData.amenities?.find(
                            (a) => a.type === "Luggage Space"
                          )?.value || ""
                        }
                        onChange={(e) => {
                          const amenities = [...(formData.amenities || [])];
                          const index = amenities.findIndex(
                            (a) => a.type === "Luggage Space"
                          );
                          if (index >= 0) {
                            amenities[index].value = e.target.value;
                          } else {
                            amenities.push({
                              type: "Luggage Space",
                              value: e.target.value,
                            });
                          }
                          setFormData({ ...formData, amenities });
                        }}
                        className="border-slate-300"
                      />
                    </div>
                  </div>
                </div> */}

                {/* Contact Details Section */}
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <h3 className="text-lg font-medium text-slate-800 mb-4">
                    Contact Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="contactPhone" className="text-slate-700">
                        Phone Number
                      </Label>
                      <Input
                        id="contactPhone"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone || ""}
                        onChange={handleInputChange}
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="contactEmail" className="text-slate-700">
                        Email
                      </Label>
                      <Input
                        id="contactEmail"
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        value={formData.email || ""}
                        onChange={handleInputChange}
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="contactWebsite"
                        className="text-slate-700"
                      >
                        Website
                      </Label>
                      <Input
                        id="contactWebsite"
                        name="website"
                        type="url"
                        placeholder="Enter website URL"
                        value={formData.website || ""}
                        onChange={handleInputChange}
                        className="border-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Coordinates Section */}
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <h3 className="text-lg font-medium text-slate-800 mb-4">
                    Location Coordinates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="latitude" className="text-slate-700">
                        Latitude
                      </Label>
                      <Input
                        id="latitude"
                        name="latitude"
                        type="number"
                        step="any"
                        placeholder="Enter latitude"
                        value={formData.latitude || ""}
                        onChange={handleInputChange}
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="longitude" className="text-slate-700">
                        Longitude
                      </Label>
                      <Input
                        id="longitude"
                        name="longitude"
                        type="number"
                        step="any"
                        placeholder="Enter longitude"
                        value={formData.longitude || ""}
                        onChange={handleInputChange}
                        className="border-slate-300"
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending || uploadingImages}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {updateMutation.isPending ? "Updating..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      )}
      {/* View Transport Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Transport Details</DialogTitle>
          </DialogHeader>
          {currentEntity && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Transport Identity */}
              <div className="flex flex-col items-center p-4 border rounded-lg border-slate-200 bg-slate-50">
                {currentEntity.images?.[0] ? (
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      fill
                      src={currentEntity.images[0].imageUrl}
                      alt={currentEntity.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-slate-100 rounded-md flex items-center justify-center mb-4">
                    <ImageIcon className="h-12 w-12 text-slate-400" />
                  </div>
                )}

                <h3 className="text-2xl font-bold text-slate-800">
                  {currentEntity.title || "No Title"}
                </h3>
                <p className="text-slate-500 mb-4">
                  {getTransportTypeName(currentEntity.transportTypeId) ||
                    "No Type"}
                </p>

                <div className="w-full mt-2">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-slate-700">
                      Vista Verification
                    </span>
                    <Badge
                      variant={
                        currentEntity.vistaVerified ? "default" : "outline"
                      }
                    >
                      {currentEntity.vistaVerified
                        ? "Verified"
                        : "Not Verified"}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">
                      Rating
                    </span>
                    <div className="flex items-center text-yellow-600">
                      ⭐ {currentEntity.reviews?.vistaReview?.rating || "N/A"}
                      <span className="ml-1 text-xs text-slate-500">
                        ({currentEntity.reviews?.travelerReviews?.length || 0}{" "}
                        reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Transport Details */}
              <div className="space-y-4">
                <div className="p-4 border rounded-lg border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Operator Information
                  </h4>
                  <p className="text-slate-600 mb-4">
                    {currentEntity.operatorName || "Not specified"}
                  </p>

                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Route
                  </h4>
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">
                      {currentEntity?.departureCity || "Unknown"} →{" "}
                      {currentEntity?.arrivalCity || "Unknown"}
                    </span>
                  </div>

                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Price per Kilometer
                  </h4>
                  <p className="text-slate-600">
                    {currentEntity.pricePerKmUSD
                      ? `$${currentEntity.pricePerKmUSD} USD/km`
                      : "Not specified"}
                  </p>
                </div>

                <div className="p-4 border rounded-lg border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Description
                  </h4>
                  <p className="text-slate-600">
                    {currentEntity.description || "No description available"}
                  </p>
                </div>

                {/* Additional Images */}
                {currentEntity.images?.length > 1 && (
                  <div className="p-4 border rounded-lg border-slate-200">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">
                      Additional Images
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentEntity.images.slice(1).map((image, index) => (
                        <Image
                          key={index}
                          src={image}
                          fill
                          alt={`Transport ${index + 1}`}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0 mt-6">
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
                Delete Transport
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
                    Are you sure you want to delete this transport service?
                  </p>
                  <p className="mt-1 text-sm text-red-700">
                    Deleting{" "}
                    <span className="font-semibold">
                      {currentEntity?.title || "this transport"}
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
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
