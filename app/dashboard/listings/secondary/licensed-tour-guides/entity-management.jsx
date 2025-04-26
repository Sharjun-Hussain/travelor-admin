// components/entity-management.tsx
import { useState } from "react";
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
  Phone,
  Loader2,
  CheckCircle,
  MessageSquare,
  Instagram,
  Facebook,
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
    name: "",
    profileImage: "",
    bio: "",
    languagesSpoken: [],
    licenseId: "",
    licenseExpiry: "",
    yearsOfExperience: 0,
    specialties: [],
    regionsCovered: [],
    rating: 0,
    reviews: [
      {
        name: "",
        comment: "",
        rating: 0,
        date: "",
      },
    ],
    slvistaReviews: {
      reviewerName: "",
      comment: "",
      rating: 0,
      date: "",
    },

    verifiedByVista: false,
    contact: {
      phone: "",
      email: "",
      whatsapp: "",
    },
    ratePerDay: {
      currency: "",
      amount: 0,
    },
    socials: {
      instagram: "",
      facebook: "",
    },
    tags: [],
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
          description: `${newEntity.name} has been added to your ${entityName} list.`,
        }
      );
      setIsAddDialogOpen(false);
      setFormData(initialFormData);
    },
    onError: (error) => {
      toast.error(`Failed to add ${entityName}`, {
        description: `There was an error adding the ${entityName}. Please try again.`,
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
      entity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const handleAddEntity = (e) => {
    e.preventDefault();
    if (addEntity) {
      addMutation.mutate(formData);
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
                    <Button variant="outline" className="border-slate-300">
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

      {/* Add Guide Dialog */}
      {addEntity && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New Tour Guide</DialogTitle>
              <DialogDescription>
                Register a new tour guide for your platform
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddEntity}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-slate-700">
                      Guide Name*
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter guide's full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="profileImage" className="text-slate-700">
                      Profile Image URL
                    </Label>
                    <Input
                      id="profileImage"
                      name="profileImage"
                      placeholder="Enter image URL"
                      value={formData.profileImage || ""}
                      onChange={handleInputChange}
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bio" className="text-slate-700">
                      Bio*
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Enter guide's bio"
                      value={formData.bio || ""}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="languagesSpoken" className="text-slate-700">
                      Languages Spoken (comma separated)*
                    </Label>
                    <Input
                      id="languagesSpoken"
                      name="languagesSpoken"
                      placeholder="English, Sinhala, Tamil"
                      value={formData.languagesSpoken?.join(", ") || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          languagesSpoken: e.target.value
                            .split(",")
                            .map((lang) => lang.trim()),
                        })
                      }
                      required
                      className="border-slate-300"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="licenseId" className="text-slate-700">
                      License ID*
                    </Label>
                    <Input
                      id="licenseId"
                      name="licenseId"
                      placeholder="Enter license ID"
                      value={formData.licenseId || ""}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="licenseExpiry" className="text-slate-700">
                      License Expiry Date*
                    </Label>
                    <Input
                      id="licenseExpiry"
                      name="licenseExpiry"
                      type="date"
                      value={formData.licenseExpiry || ""}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="yearsOfExperience"
                      className="text-slate-700"
                    >
                      Years of Experience*
                    </Label>
                    <Input
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      type="number"
                      placeholder="Enter years of experience"
                      value={formData.yearsOfExperience || ""}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="regionsCovered" className="text-slate-700">
                      Regions Covered (comma separated)*
                    </Label>
                    <Input
                      id="regionsCovered"
                      name="regionsCovered"
                      placeholder="Central, Southern, Western"
                      value={formData.regionsCovered?.join(", ") || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          regionsCovered: e.target.value
                            .split(",")
                            .map((region) => region.trim()),
                        })
                      }
                      required
                      className="border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Specialties Section */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <h3 className="text-lg font-medium text-slate-800 mb-4">
                  Guide Specialties
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="specialties" className="text-slate-700">
                      Specialties (comma separated)*
                    </Label>
                    <Input
                      id="specialties"
                      name="specialties"
                      placeholder="Historical Tours, Wildlife Safaris"
                      value={formData.specialties?.join(", ") || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialties: e.target.value
                            .split(",")
                            .map((spec) => spec.trim()),
                        })
                      }
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="ratePerDay" className="text-slate-700">
                      Rate Per Day*
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="rateAmount"
                        name="ratePerDay.amount"
                        type="number"
                        placeholder="Amount"
                        value={formData.ratePerDay?.amount || ""}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                      <Select
                        value={formData.ratePerDay?.currency || "USD"}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            ratePerDay: {
                              ...formData.ratePerDay,
                              currency: value,
                            },
                          })
                        }
                        required
                      >
                        <SelectTrigger className="w-[100px] border-slate-300">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="LKR">LKR</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <h3 className="text-lg font-medium text-slate-800 mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="contactPhone" className="text-slate-700">
                      Phone Number*
                    </Label>
                    <Input
                      id="contactPhone"
                      name="contact.phone"
                      placeholder="Enter phone number"
                      value={formData.contact?.phone || ""}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="contactEmail" className="text-slate-700">
                      Email*
                    </Label>
                    <Input
                      id="contactEmail"
                      name="contact.email"
                      type="email"
                      placeholder="Enter email"
                      value={formData.contact?.email || ""}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="whatsapp" className="text-slate-700">
                      WhatsApp
                    </Label>
                    <Input
                      id="whatsapp"
                      name="contact.whatsapp"
                      placeholder="Enter WhatsApp number"
                      value={formData.contact?.whatsapp || ""}
                      onChange={handleInputChange}
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="verifiedByVista" className="text-slate-700">
                      SLVista Verified
                    </Label>
                    <Select
                      value={formData.verifiedByVista ? "true" : "false"}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          verifiedByVista: value === "true",
                        })
                      }
                    >
                      <SelectTrigger className="border-slate-300">
                        <SelectValue placeholder="Select verification status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Verified</SelectItem>
                        <SelectItem value="false">Not Verified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <h3 className="text-lg font-medium text-slate-800 mb-4">
                  Social Media Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="instagram" className="text-slate-700">
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      name="socials.instagram"
                      type="url"
                      placeholder="https://instagram.com/username"
                      value={formData.socials?.instagram || ""}
                      onChange={handleInputChange}
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="facebook" className="text-slate-700">
                      Facebook
                    </Label>
                    <Input
                      id="facebook"
                      name="socials.facebook"
                      type="url"
                      placeholder="https://facebook.com/username"
                      value={formData.socials?.facebook || ""}
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
                  disabled={addMutation.isPending}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {addMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Guide"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Guide Dialog */}
      {updateEntity && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Edit Tour Guide</DialogTitle>
              <DialogDescription>
                Update tour guide information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateEntity}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-slate-700">
                      Guide Name*
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter guide's full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="profileImage" className="text-slate-700">
                      Profile Image URL
                    </Label>
                    <Input
                      id="profileImage"
                      name="profileImage"
                      placeholder="Enter image URL"
                      value={formData.profileImage || ""}
                      onChange={handleInputChange}
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bio" className="text-slate-700">
                      Bio*
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Enter guide's bio"
                      value={formData.bio || ""}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="languagesSpoken" className="text-slate-700">
                      Languages Spoken (comma separated)*
                    </Label>
                    <Input
                      id="languagesSpoken"
                      name="languagesSpoken"
                      placeholder="English, Sinhala, Tamil"
                      value={formData.languagesSpoken?.join(", ") || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          languagesSpoken: e.target.value
                            .split(",")
                            .map((lang) => lang.trim()),
                        })
                      }
                      required
                      className="border-slate-300"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="licenseId" className="text-slate-700">
                      License ID*
                    </Label>
                    <Input
                      id="licenseId"
                      name="licenseId"
                      placeholder="Enter license ID"
                      value={formData.licenseId || ""}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="licenseExpiry" className="text-slate-700">
                      License Expiry Date*
                    </Label>
                    <Input
                      id="licenseExpiry"
                      name="licenseExpiry"
                      type="date"
                      value={formData.licenseExpiry || ""}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="yearsOfExperience"
                      className="text-slate-700"
                    >
                      Years of Experience*
                    </Label>
                    <Input
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      type="number"
                      placeholder="Enter years of experience"
                      value={formData.yearsOfExperience || ""}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="regionsCovered" className="text-slate-700">
                      Regions Covered (comma separated)*
                    </Label>
                    <Input
                      id="regionsCovered"
                      name="regionsCovered"
                      placeholder="Central, Southern, Western"
                      value={formData.regionsCovered?.join(", ") || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          regionsCovered: e.target.value
                            .split(",")
                            .map((region) => region.trim()),
                        })
                      }
                      required
                      className="border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Specialties Section */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <h3 className="text-lg font-medium text-slate-800 mb-4">
                  Guide Specialties
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="specialties" className="text-slate-700">
                      Specialties (comma separated)*
                    </Label>
                    <Input
                      id="specialties"
                      name="specialties"
                      placeholder="Historical Tours, Wildlife Safaris"
                      value={formData.specialties?.join(", ") || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialties: e.target.value
                            .split(",")
                            .map((spec) => spec.trim()),
                        })
                      }
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="ratePerDay" className="text-slate-700">
                      Rate Per Day*
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="rateAmount"
                        name="ratePerDay.amount"
                        type="number"
                        placeholder="Amount"
                        value={formData.ratePerDay?.amount || ""}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300"
                      />
                      <Select
                        value={formData.ratePerDay?.currency || "USD"}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            ratePerDay: {
                              ...formData.ratePerDay,
                              currency: value,
                            },
                          })
                        }
                        required
                      >
                        <SelectTrigger className="w-[100px] border-slate-300">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="LKR">LKR</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <h3 className="text-lg font-medium text-slate-800 mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="contactPhone" className="text-slate-700">
                      Phone Number*
                    </Label>
                    <Input
                      id="contactPhone"
                      name="contact.phone"
                      placeholder="Enter phone number"
                      value={formData.contact?.phone || ""}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="contactEmail" className="text-slate-700">
                      Email*
                    </Label>
                    <Input
                      id="contactEmail"
                      name="contact.email"
                      type="email"
                      placeholder="Enter email"
                      value={formData.contact?.email || ""}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="whatsapp" className="text-slate-700">
                      WhatsApp
                    </Label>
                    <Input
                      id="whatsapp"
                      name="contact.whatsapp"
                      placeholder="Enter WhatsApp number"
                      value={formData.contact?.whatsapp || ""}
                      onChange={handleInputChange}
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="verifiedByVista" className="text-slate-700">
                      SLVista Verified
                    </Label>
                    <Select
                      value={formData.verifiedByVista ? "true" : "false"}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          verifiedByVista: value === "true",
                        })
                      }
                    >
                      <SelectTrigger className="border-slate-300">
                        <SelectValue placeholder="Select verification status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Verified</SelectItem>
                        <SelectItem value="false">Not Verified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <h3 className="text-lg font-medium text-slate-800 mb-4">
                  Social Media Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="instagram" className="text-slate-700">
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      name="socials.instagram"
                      type="url"
                      placeholder="https://instagram.com/username"
                      value={formData.socials?.instagram || ""}
                      onChange={handleInputChange}
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="facebook" className="text-slate-700">
                      Facebook
                    </Label>
                    <Input
                      id="facebook"
                      name="socials.facebook"
                      type="url"
                      placeholder="https://facebook.com/username"
                      value={formData.socials?.facebook || ""}
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
                  disabled={updateMutation.isPending}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* View Guide Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Tour Guide Details</DialogTitle>
          </DialogHeader>
          {currentEntity && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Guide Identity */}
              <div className="flex flex-col items-center p-4 border rounded-lg border-slate-200 bg-slate-50">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage
                    src={currentEntity.profileImage}
                    alt={currentEntity.name}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl">
                    {currentEntity.name
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-2xl font-bold text-slate-800 text-center">
                  {currentEntity.name}
                </h3>
                <div className="flex items-center mt-2">
                  {currentEntity.verifiedByVista && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verified Guide
                    </Badge>
                  )}
                </div>

                <div className="w-full mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">
                      License ID
                    </span>
                    <span className="text-slate-600">
                      {currentEntity.licenseId}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">
                      Experience
                    </span>
                    <span className="text-slate-600">
                      {currentEntity.yearsOfExperience} years
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">
                      Rate
                    </span>
                    <span className="text-slate-600">
                      {currentEntity.ratePerDay?.currency}{" "}
                      {currentEntity.ratePerDay?.amount}/day
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">
                      Rating
                    </span>
                    <div className="flex items-center text-yellow-600">
                      ⭐ {currentEntity.rating || "N/A"}
                      <span className="ml-1 text-xs text-slate-500">
                        ({currentEntity.reviews?.length || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Guide Details */}
              <div className="space-y-4">
                <div className="p-4 border rounded-lg border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Bio
                  </h4>
                  <p className="text-slate-600">
                    {currentEntity.bio || "No bio available"}
                  </p>
                </div>

                <div className="p-4 border rounded-lg border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Languages Spoken
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentEntity.languagesSpoken?.map((lang, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-slate-600"
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 border rounded-lg border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Specialties & Regions
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        Specialties:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {currentEntity.specialties?.map((spec, index) => (
                          <Badge
                            key={index}
                            className="bg-blue-100 text-blue-800"
                          >
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        Regions Covered:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {currentEntity.regionsCovered?.map((region, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-slate-600"
                          >
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Contact Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-slate-400" />
                      <span className="text-slate-600">
                        {currentEntity.contact?.phone || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-slate-400" />
                      <span className="text-slate-600">
                        {currentEntity.contact?.email || "N/A"}
                      </span>
                    </div>
                    {currentEntity.contact?.whatsapp && (
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-slate-400" />
                        <span className="text-slate-600">
                          {currentEntity.contact.whatsapp}
                        </span>
                      </div>
                    )}
                    {currentEntity.socials?.instagram && (
                      <div className="flex items-center">
                        <Instagram className="h-4 w-4 mr-2 text-slate-400" />
                        <a
                          href={currentEntity.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Instagram
                        </a>
                      </div>
                    )}
                    {currentEntity.socials?.facebook && (
                      <div className="flex items-center">
                        <Facebook className="h-4 w-4 mr-2 text-slate-400" />
                        <a
                          href={currentEntity.socials.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Facebook
                        </a>
                      </div>
                    )}
                  </div>
                </div>
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
                Delete Tour Guide
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
                    Are you sure you want to delete this tour guide?
                  </p>
                  <p className="mt-1 text-sm text-red-700">
                    Deleting{" "}
                    <span className="font-semibold">{currentEntity?.name}</span>{" "}
                    will remove all their data from your platform.
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
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
