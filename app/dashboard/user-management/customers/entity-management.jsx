// components/entity-management.tsx
import { useState, useRef, useEffect, Fragment } from "react";
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
  Phone,
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
  statusfilterenabled = false,
  initialFormData = {
    id: "",
    userId: "",
    businessName: "",
    businessRegistrationNumber: "",
    businessType: "",
    businessDescription: "",
    isSriLankan: true,
    nicNumber: "",
    passportNumber: "",
    address: "",
    city: "",
    country: "Sri Lanka",
    phoneNumber: "",
    status: "pending",
    maxPropertiesAllowed: 1,
    verificationDate: null,
    suspensionReason: null,
    user: {
      id: "",
      email: "",
      name: "",
      accountType: "merchant",
      isActive: true
    }
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
  const [isDeclineReasonDialogOpen, setDeclineReasonDialogOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (hostId) => axios.patch(`/hosts/${hostId}/approve`),
    onSuccess: () => {
      toast.success("Host approved successfully");
      refetch();
      setIsViewDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to approve host");
    }
  });

  // Decline mutation
  const declineMutation = useMutation({
    mutationFn: ({ hostId, reason }) =>
      axios.patch(`/hosts/${hostId}/decline`, { reason }),
    onSuccess: () => {
      toast.success("Host declined successfully");
      refetch();
      setIsViewDialogOpen(false);
      setDeclineReason("");
    },
    onError: () => {
      toast.error("Failed to decline host");
    }
  });

  const handleApproveHost = (hostId) => {
    approveMutation.mutate(hostId);
  };

  const handleDeclineHost = (hostId, reason) => {
    declineMutation.mutate({ hostId, reason });
  };





  const datafromlocalstorage = JSON.parse(localStorage.getItem("user"));
  console.log(datafromlocalstorage.data.accessToken);

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
        description: `${updatedEntity.name || updatedEntity.title
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
      entity.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entity.website &&
        entity.website.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
    newformdata.append("transportTypes", formData.transportTypes);
    newformdata.append("address", formData.address);
    newformdata.append("city", formData.city);
    newformdata.append("district", formData.district);
    newformdata.append("province", formData.province);
    newformdata.append("serviceArea", formData.serviceArea);
    newformdata.append("description", formData.description);
    newformdata.append("email", formData.email);
    newformdata.append("website", formData.website);
    newformdata.append("phone", formData.phone);
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
                  className={`${enableSearch
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
              <DialogTitle className="text-xl">Add New Host</DialogTitle>
              <DialogDescription>
                Register a new host business on your platform
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
                  {/* Left Column - Business Details */}
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="businessName" className="text-slate-700">
                        Business Name*
                      </Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        placeholder="Enter business name"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="businessType" className="text-slate-700">
                        Business Type*
                      </Label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, businessType: value })
                        }
                      >
                        <SelectTrigger className="border-slate-300">
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hotel">Hotel</SelectItem>
                          <SelectItem value="guesthouse">Guesthouse</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="resort">Resort</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="businessRegistrationNumber" className="text-slate-700">
                        Registration Number*
                      </Label>
                      <Input
                        id="businessRegistrationNumber"
                        name="businessRegistrationNumber"
                        placeholder="Enter registration number"
                        value={formData.businessRegistrationNumber}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="isSriLankan" className="text-slate-700">
                        Sri Lankan Business
                      </Label>
                      <Select
                        value={formData.isSriLankan ? "true" : "false"}
                        onValueChange={(value) =>
                          setFormData({ ...formData, isSriLankan: value === "true" })
                        }
                      >
                        <SelectTrigger className="border-slate-300">
                          <SelectValue placeholder="Is this a Sri Lankan business?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.isSriLankan ? (
                      <div className="grid gap-2">
                        <Label htmlFor="nicNumber" className="text-slate-700">
                          NIC Number*
                        </Label>
                        <Input
                          id="nicNumber"
                          name="nicNumber"
                          placeholder="Enter NIC number"
                          value={formData.nicNumber}
                          onChange={handleInputChange}
                          required={formData.isSriLankan}
                          className="border-slate-300"
                        />
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <Label htmlFor="passportNumber" className="text-slate-700">
                          Passport Number*
                        </Label>
                        <Input
                          id="passportNumber"
                          name="passportNumber"
                          placeholder="Enter passport number"
                          value={formData.passportNumber}
                          onChange={handleInputChange}
                          required={!formData.isSriLankan}
                          className="border-slate-300"
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Column - Location Details */}
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="address" className="text-slate-700">
                        Address*
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="Enter business address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="city" className="text-slate-700">
                        City*
                      </Label>
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
                      <Label htmlFor="country" className="text-slate-700">
                        Country*
                      </Label>
                      <Input
                        id="country"
                        name="country"
                        placeholder="Enter country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phoneNumber" className="text-slate-700">
                        Phone Number*
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Enter phone number with country code"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="maxPropertiesAllowed" className="text-slate-700">
                        Max Properties Allowed
                      </Label>
                      <Input
                        id="maxPropertiesAllowed"
                        name="maxPropertiesAllowed"
                        type="number"
                        min="1"
                        placeholder="Enter maximum properties allowed"
                        value={formData.maxPropertiesAllowed}
                        onChange={handleInputChange}
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="businessDescription" className="text-slate-700">
                        Business Description
                      </Label>
                      <Textarea
                        id="businessDescription"
                        name="businessDescription"
                        placeholder="Enter business description"
                        value={formData.businessDescription}
                        onChange={handleInputChange}
                        className="border-slate-300"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* User Account Section */}
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <h3 className="text-lg font-medium text-slate-800 mb-4">
                    User Account Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="user.email" className="text-slate-700">
                        Email*
                      </Label>
                      <Input
                        id="user.email"
                        name="user.email"
                        type="email"
                        placeholder="Enter user email"
                        value={formData.user?.email || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            user: { ...formData.user, email: e.target.value },
                          })
                        }
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="user.name" className="text-slate-700">
                        Name*
                      </Label>
                      <Input
                        id="user.name"
                        name="user.name"
                        placeholder="Enter user name"
                        value={formData.user?.name || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            user: { ...formData.user, name: e.target.value },
                          })
                        }
                        required
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
                    disabled={addMutation.isPending}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {addMutation.isPending ? "Adding..." : "Add Host"}
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
                  {/* Left Column - Business Details */}
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="businessName" className="text-slate-700">
                        Business Name*
                      </Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        placeholder="Enter business name"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="businessType" className="text-slate-700">
                        Business Type*
                      </Label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, businessType: value })
                        }
                      >
                        <SelectTrigger className="border-slate-300">
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hotel">Hotel</SelectItem>
                          <SelectItem value="guesthouse">Guesthouse</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="resort">Resort</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="businessRegistrationNumber" className="text-slate-700">
                        Registration Number*
                      </Label>
                      <Input
                        id="businessRegistrationNumber"
                        name="businessRegistrationNumber"
                        placeholder="Enter registration number"
                        value={formData.businessRegistrationNumber}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="isSriLankan" className="text-slate-700">
                        Sri Lankan Business
                      </Label>
                      <Select
                        value={formData.isSriLankan ? "true" : "false"}
                        onValueChange={(value) =>
                          setFormData({ ...formData, isSriLankan: value === "true" })
                        }
                      >
                        <SelectTrigger className="border-slate-300">
                          <SelectValue placeholder="Is this a Sri Lankan business?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.isSriLankan ? (
                      <div className="grid gap-2">
                        <Label htmlFor="nicNumber" className="text-slate-700">
                          NIC Number*
                        </Label>
                        <Input
                          id="nicNumber"
                          name="nicNumber"
                          placeholder="Enter NIC number"
                          value={formData.nicNumber}
                          onChange={handleInputChange}
                          required={formData.isSriLankan}
                          className="border-slate-300"
                        />
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <Label htmlFor="passportNumber" className="text-slate-700">
                          Passport Number*
                        </Label>
                        <Input
                          id="passportNumber"
                          name="passportNumber"
                          placeholder="Enter passport number"
                          value={formData.passportNumber}
                          onChange={handleInputChange}
                          required={!formData.isSriLankan}
                          className="border-slate-300"
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Column - Location Details */}
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="address" className="text-slate-700">
                        Address*
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="Enter business address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="city" className="text-slate-700">
                        City*
                      </Label>
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
                      <Label htmlFor="country" className="text-slate-700">
                        Country*
                      </Label>
                      <Input
                        id="country"
                        name="country"
                        placeholder="Enter country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phoneNumber" className="text-slate-700">
                        Phone Number*
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Enter phone number with country code"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="maxPropertiesAllowed" className="text-slate-700">
                        Max Properties Allowed
                      </Label>
                      <Input
                        id="maxPropertiesAllowed"
                        name="maxPropertiesAllowed"
                        type="number"
                        min="1"
                        placeholder="Enter maximum properties allowed"
                        value={formData.maxPropertiesAllowed}
                        onChange={handleInputChange}
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="businessDescription" className="text-slate-700">
                        Business Description
                      </Label>
                      <Textarea
                        id="businessDescription"
                        name="businessDescription"
                        placeholder="Enter business description"
                        value={formData.businessDescription}
                        onChange={handleInputChange}
                        className="border-slate-300"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* User Account Section */}
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <h3 className="text-lg font-medium text-slate-800 mb-4">
                    User Account Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="user.email" className="text-slate-700">
                        Email*
                      </Label>
                      <Input
                        id="user.email"
                        name="user.email"
                        type="email"
                        placeholder="Enter user email"
                        value={formData.user?.email || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            user: { ...formData.user, email: e.target.value },
                          })
                        }
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="user.name" className="text-slate-700">
                        Name*
                      </Label>
                      <Input
                        id="user.name"
                        name="user.name"
                        placeholder="Enter user name"
                        value={formData.user?.name || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            user: { ...formData.user, name: e.target.value },
                          })
                        }
                        required
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
      {/* View Host Dialog */}
      {/* View Host Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Host Details</DialogTitle>
            {currentEntity?.status === "pending" && (
              <DialogDescription className="text-orange-600">
                This host is pending verification
              </DialogDescription>
            )}
          </DialogHeader>
          {currentEntity && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Host Identity */}
              <div className="flex flex-col items-center p-4 border rounded-lg border-slate-200 bg-slate-50">
                <div className="h-48 w-full bg-slate-100 rounded-md flex items-center justify-center mb-4">
                  <Building2 className="h-12 w-12 text-slate-400" />
                </div>

                <h3 className="text-2xl font-bold text-slate-800">
                  {currentEntity.businessName || "No Business Name"}
                </h3>
                <p className="text-slate-500 mb-4 capitalize">
                  {currentEntity.businessType || "No Type"}
                </p>

                <div className="w-full mt-2">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-slate-700">
                      Status
                    </span>
                    <Badge variant={
                      currentEntity.status === "verified" ? "default" :
                        currentEntity.status === "suspended" ? "destructive" :
                          currentEntity.status === "pending" ? "warning" : "outline"
                    }>
                      {currentEntity.status ?
                        currentEntity.status.charAt(0).toUpperCase() + currentEntity.status.slice(1) :
                        "Unknown"}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-slate-700">
                      Registration
                    </span>
                    <span className="text-sm text-slate-600">
                      {currentEntity.businessRegistrationNumber || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">
                      Properties Allowed
                    </span>
                    <span className="text-sm text-slate-600">
                      {currentEntity.maxPropertiesAllowed || "1"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column - Host Details */}
              <div className="space-y-4">
                <div className="p-4 border rounded-lg border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Identification
                  </h4>
                  <p className="text-slate-600 mb-2">
                    {currentEntity.isSriLankan ?
                      `NIC: ${currentEntity.nicNumber || "Not provided"}` :
                      `Passport: ${currentEntity.passportNumber || "Not provided"}`
                    }
                  </p>
                  <p className="text-slate-600">
                    {currentEntity.isSriLankan ? "Sri Lankan Business" : "Foreign Business"}
                  </p>
                </div>

                <div className="p-4 border rounded-lg border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Location
                  </h4>
                  <div className="flex items-start space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                    <span className="text-slate-600">
                      {currentEntity.address || "No address"}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-slate-600">
                      {currentEntity.city || "No city"},
                    </span>
                    <span className="text-slate-600">
                      {currentEntity.country || "No country"}
                    </span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Contact Information
                  </h4>
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">
                      {currentEntity.phoneNumber || "No phone number"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">
                      {currentEntity.user?.email || "No email"}
                    </span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Business Description
                  </h4>
                  <p className="text-slate-600">
                    {currentEntity.businessDescription || "No description available"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-4 sm:gap-0mt-6">
            {currentEntity?.status === "pending" && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDeclineReasonDialogOpen(true);
                  }}
                >
                  <X className="h-4 w-4 mx-4" /> Decline
                </Button>
                <Button
                  onClick={() => handleApproveHost(currentEntity.id)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={approveMutation.isPending}
                >
                  {approveMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Approve
                </Button>
              </div>
            )}

            {updateEntity && currentEntity?.status !== "pending" && (
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

      {/* Decline Reason Dialog */}
      <Dialog open={isDeclineReasonDialogOpen} onOpenChange={setDeclineReasonDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reason for Declining</DialogTitle>
            <DialogDescription>
              Please provide a reason for declining this host application.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Enter reason for declining..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeclineReasonDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDeclineHost(currentEntity?.id, declineReason);
                setDeclineReasonDialogOpen(false);
              }}
              disabled={declineMutation.isPending}
            >
              {declineMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <X className="h-4 w-4 mr-2" />
              )}
              Submit Decline
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
