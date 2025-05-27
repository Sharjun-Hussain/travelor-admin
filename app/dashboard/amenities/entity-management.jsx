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
    name: "",
    slug: "amenity",
    icon: "icon",
    category: "category",
    language_code: "en",
    isActive: true,
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
        `${entityName.charAt(0).toUpperCase() + entityName.slice(1)
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New Amenity</DialogTitle>
              <DialogDescription>
                Create a new amenity (e.g. Free Parking, Fast Wi-Fi)
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
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-slate-700">
                      Feature Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter amenity name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="slug" className="text-slate-700">
                      Slug
                    </Label>
                    <Input
                      disabled
                      id="slug"
                      name="slug"
                      placeholder="e.g. free-parking"
                      value={formData.name.toLowerCase() || ""}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>

                  {/* <div className="grid gap-2">
                    <Label htmlFor="language_code" className="text-slate-700">
                      Language Code
                    </Label>
                    <Input
                      id="language_code"
                      name="language_code"
                      placeholder="e.g. en"
                      value={formData.language_code || ""}
                      onChange={handleInputChange}
                      className="border-slate-300"
                    />
                  </div> */}

                  {/* <div className="grid gap-2">
                    <Label htmlFor="icon" className="text-slate-700">
                      Icon (URL or Emoji)
                    </Label>
                    <Input
                      id="icon"
                      name="icon"
                      placeholder="Optional icon URL or emoji"
                      value={formData.icon || ""}
                      onChange={handleInputChange}
                      className="border-slate-300"
                    />
                  </div> */}

                  {/* <div className="grid gap-2">
                    <Label htmlFor="category" className="text-slate-700">
                      Category
                    </Label>
                    <Input
                      id="category"
                      name="category"
                      placeholder="Optional category"
                      value={formData.category || ""}
                      onChange={handleInputChange}
                      className="border-slate-300"
                    />
                  </div> */}

                  <div className="grid gap-2">
                    <Label htmlFor="isActive" className="text-slate-700">
                      Active Status
                    </Label>
                    <Select
                      value={formData.isActive ? "true" : "false"}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: value === "true",
                        }))
                      }
                    >
                      <SelectTrigger className="border-slate-300 w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

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
                    {addMutation.isPending ? "Adding..." : "Add Amenity"}
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
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Edit Amenity</DialogTitle>
              <DialogDescription>Update amenity information</DialogDescription>
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
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-slate-700">
                      Feature Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter feature name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>

                  {/* <div className="grid gap-2">
                    <Label htmlFor="slug" className="text-slate-700">
                      Slug
                    </Label>
                    <Input
                      id="slug"
                      name="slug"
                      placeholder="e.g. free-parking"
                      value={formData.slug || ""}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div> */}

                  {/* <div className="grid gap-2">
                    <Label htmlFor="language_code" className="text-slate-700">
                      Language Code
                    </Label>
                    <Input
                      id="language_code"
                      name="language_code"
                      placeholder="e.g. en"
                      value={formData.language_code || ""}
                      onChange={handleInputChange}
                      className="border-slate-300"
                    />
                  </div> */}

                  {/* <div className="grid gap-2">
                    <Label htmlFor="icon" className="text-slate-700">
                      Icon (URL or Emoji)
                    </Label>
                    <Input
                      id="icon"
                      name="icon"
                      placeholder="Optional icon URL or emoji"
                      value={formData.icon || ""}
                      onChange={handleInputChange}
                      className="border-slate-300"
                    />
                  </div> */}

                  {/* <div className="grid gap-2">
                    <Label htmlFor="category" className="text-slate-700">
                      Category
                    </Label>
                    <Input
                      id="category"
                      name="category"
                      placeholder="Optional category"
                      value={formData.category || ""}
                      onChange={handleInputChange}
                      className="border-slate-300"
                    />
                  </div> */}

                  <div className="grid gap-2">
                    <Label htmlFor="isActive" className="text-slate-700">
                      Active Status
                    </Label>
                    <Select
                      value={formData.isActive ? "true" : "false"}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: value === "true",
                        }))
                      }
                    >
                      <SelectTrigger className="border-slate-300 w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
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
                    {updateMutation.isPending ? "Updating..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* View Activity Dialog */}
      {/* <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Activity Details</DialogTitle>
          </DialogHeader>
          {currentEntity && (
            <ScrollArea className="max-h-[60vh]">
              {viewDetails ? (
                viewDetails(currentEntity)
              ) : (
                <div className="p-2">
                  <div className="flex flex-col items-center pb-4 mb-4 border-b border-slate-200">
                    <Avatar className="h-20 w-20 mb-3">
                      <AvatarImage
                        src={currentEntity.images?.[0]}
                        alt={currentEntity.title}
                      />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xl">
                        {currentEntity.title
                          ?.split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-slate-800">
                      {currentEntity.title}
                    </h3>
                    <p className="text-slate-500">{currentEntity.type}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        {currentEntity.location?.city},{" "}
                        {currentEntity.location?.district}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-1">
                        Price Range
                      </h4>
                      <p className="text-slate-600">
                        {currentEntity.priceRangeUSD}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-1">
                        Vista Verification
                      </h4>
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

                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-1">
                        Rating
                      </h4>
                      <div className="flex items-center text-yellow-600">
                        ⭐ {currentEntity.reviews?.vistaReview?.rating || "N/A"}
                        <span className="ml-1 text-xs text-slate-500">
                          ({currentEntity.reviews?.travelerReviews?.length || 0}{" "}
                          reviews)
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-1">
                        Contact Details
                      </h4>
                      <div className="text-sm text-slate-600">
                        <p>
                          {currentEntity.contactDetails?.phone || "No phone"}
                        </p>
                        <p>
                          {currentEntity.contactDetails?.email || "No email"}
                        </p>
                      </div>
                    </div>
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
      </Dialog> */}

      {/* Delete Confirmation Dialog */}
      {deleteEntity && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-red-600">
                Delete Activity
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
                    Are you sure you want to delete this activity?
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
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
