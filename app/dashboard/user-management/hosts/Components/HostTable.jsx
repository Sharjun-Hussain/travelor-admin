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

const defaultColumns = [
  {
    key: "name",
    label: "Host",
    visible: true,
    sortable: true,
    render: (host) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={host.avatar} alt={host.name} />
          <AvatarFallback className="bg-indigo-100 text-indigo-700">
            {host.name
              .split(" ")
              .map((word) => word[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-slate-800">{host.name}</p>
          <p className="text-sm text-slate-500">{host.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "properties",
    label: "Properties",
    visible: true,
    sortable: true,
    render: (host) => (
      <div className="flex items-center">
        <div className="h-6 w-6 bg-indigo-100 rounded flex items-center justify-center mr-2">
          <Building2 className="h-3 w-3 text-indigo-700" />
        </div>
        <span className="font-medium">{host.properties}</span>
        {host.locations > 1 && (
          <Badge variant="outline" className="ml-2 text-xs">
            {host.locations} locations
          </Badge>
        )}
      </div>
    ),
  },
  {
    key: "location",
    label: "Location",
    visible: true,
    sortable: true,
    render: (host) => (
      <div className="flex items-center">
        <MapPin className="h-3 w-3 text-slate-400 mr-1" />
        <span>
          {host.city}, {host.country}
        </span>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    visible: true,
    sortable: false,
    render: (host) => renderDefaultStatusBadge(host.status),
  },
  {
    key: "joinDate",
    label: "Join Date",
    visible: true,
    sortable: true,
    render: (host) => (
      <div className="flex items-center">
        <Calendar className="h-3 w-3 text-slate-400 mr-1" />
        {host.joinDate}
      </div>
    ),
  },
  {
    key: "rating",
    label: "Rating",
    visible: true,
    sortable: true,
    render: (host) => renderDefaultRatingStars(host.rating),
  },
];

const defaultStatusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "inactive", label: "Inactive" },
];

export const renderDefaultStatusBadge = (status) => {
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

const renderDefaultRatingStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center">
      <span className="font-medium mr-2">{rating}</span>
      <div className="flex text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < fullStars
                ? "fill-current"
                : i === fullStars && hasHalfStar
                ? "fill-current opacity-50"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const HostManagement = ({
  fetchHosts,
  addHost,
  updateHost,
  deleteHost,
  columns = defaultColumns,
  statusOptions = defaultStatusOptions,
  defaultPageSize = 5,
  enableTabs = true,
  enableSearch = true,
  enableFilters = true,
  enableExport = true,
  customFilters,
  onHostClick,
  renderStatusBadge = renderDefaultStatusBadge,
  renderRatingStars = renderDefaultRatingStars,
  additionalTabs = [],
  headerTitle = "Host Management",
  headerDescription = "Manage all your property hosts and partners",
  addButtonLabel = "Add New Host",
  emptyState,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentHost, setCurrentHost] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    locations: 1,
    status: "pending",
    country: "",
    city: "",
    contactPerson: "",
  });

  const queryClient = useQueryClient();

  // Query hooks
  const {
    data: hosts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["hosts"],
    queryFn: fetchHosts,
  });

  // Mutation hooks
  const addMutation = useMutation({
    mutationFn: addHost,
    onSuccess: (newHost) => {
      queryClient.setQueryData(["hosts"], (old = []) => [...old, newHost]);
      toast.success("Host added successfully", {
        description: `${newHost.name} has been added to your host list.`,
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to add host", {
        description: "There was an error adding the host. Please try again.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateHost,
    onSuccess: (updatedHost) => {
      queryClient.setQueryData(["hosts"], (old = []) =>
        old.map((host) => (host.id === updatedHost.id ? updatedHost : host))
      );
      toast.success("Changes saved", {
        description: `${updatedHost.name}'s information has been updated.`,
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to update host", {
        description: "There was an error updating the host. Please try again.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHost,
    onSuccess: (id) => {
      queryClient.setQueryData(["hosts"], (old = []) =>
        old.filter((host) => host.id !== id)
      );
      toast.error("Host removed", {
        description:
          "The host has been successfully removed from your platform.",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to delete host", {
        description: "There was an error deleting the host. Please try again.",
      });
    },
  });

  // Filter and sort hosts
  const filteredHosts = hosts.filter((host) => {
    const matchesSearch =
      host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (host.country &&
        host.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (host.city &&
        host.city.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || host.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort hosts
  const sortedHosts = [...filteredHosts].sort((a, b) => {
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
  const paginatedHosts = sortedHosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(sortedHosts.length / pageSize);

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

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      locations: 1,
      status: "pending",
      country: "",
      city: "",
      contactPerson: "",
    });
  };

  const handleAddHost = (e) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };

  const handleUpdateHost = (e) => {
    e.preventDefault();
    if (currentHost) {
      updateMutation.mutate({ ...currentHost, ...formData });
    }
  };

  const handleDeleteHost = () => {
    if (currentHost) {
      deleteMutation.mutate(currentHost.id);
    }
  };

  const openEditDialog = (host) => {
    setCurrentHost(host);
    setFormData({
      name: host.name,
      email: host.email,
      locations: host.locations,
      status: host.status,
      country: host.country || "",
      city: host.city || "",
      contactPerson: host.contactPerson || "",
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (host) => {
    setCurrentHost(host);
    setIsViewDialogOpen(true);
    if (onHostClick) {
      onHostClick(host);
    }
  };

  const openDeleteDialog = (host) => {
    setCurrentHost(host);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container items-center mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64 lg:h-96">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-t-indigo-500 border-r-indigo-300 border-b-indigo-500 border-l-indigo-300 animate-spin"></div>
            <div className="mt-4 text-lg font-medium text-slate-700">
              Loading host data...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center">
        <div className="p-6 max-w-sm bg-white rounded-lg border border-red-200 shadow-md">
          <XCircle className="h-12 w-12 text-red-500 mb-4" />
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
            Error loading data
          </h5>
          <p className="mb-3 text-gray-700">
            Unable to load host data. Please try again or contact support if the
            problem persists.
          </p>
          <Button onClick={() => queryClient.invalidateQueries(["hosts"])}>
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
            <Button
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
              className="bg-white text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" /> {addButtonLabel}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          {enableTabs && (
            <TabsList className="mb-4 bg-slate-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All Hosts
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
                        placeholder="Search hosts by name, email, location..."
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
                    <Button variant="outline" className="border-slate-300">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Host Listing Table */}
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
                            } ${
                              column.key === "properties"
                                ? "hidden md:table-cell"
                                : ""
                            } ${
                              column.key === "location"
                                ? "hidden lg:table-cell"
                                : ""
                            } ${
                              column.key === "joinDate"
                                ? "hidden lg:table-cell"
                                : ""
                            } ${
                              column.key === "rating"
                                ? "hidden xl:table-cell"
                                : ""
                            }`}
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
                      {paginatedHosts.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={visibleColumns.length + 1}
                            className="text-center py-10 text-slate-500"
                          >
                            {emptyState ||
                              "No hosts found matching your search criteria."}
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedHosts.map((host) => (
                          <TableRow
                            key={host.id}
                            className="hover:bg-slate-50/50 border-slate-200"
                          >
                            {visibleColumns.map((column) => (
                              <TableCell
                                key={`${host.id}-${column.key}`}
                                className={`
                                  ${
                                    column.key === "properties"
                                      ? "hidden md:table-cell"
                                      : ""
                                  }
                                  ${
                                    column.key === "location"
                                      ? "hidden lg:table-cell"
                                      : ""
                                  }
                                  ${
                                    column.key === "joinDate"
                                      ? "hidden lg:table-cell text-slate-600"
                                      : ""
                                  }
                                  ${
                                    column.key === "rating"
                                      ? "hidden xl:table-cell"
                                      : ""
                                  }
                                `}
                              >
                                {column.render
                                  ? column.render(host)
                                  : host[column.key]}
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
                                    onClick={() => openViewDialog(host)}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="mr-2 h-4 w-4 text-slate-500" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => openEditDialog(host)}
                                    className="cursor-pointer"
                                  >
                                    <Edit className="mr-2 h-4 w-4 text-slate-500" />
                                    Edit Host
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => openDeleteDialog(host)}
                                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete Host
                                  </DropdownMenuItem>
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
                {/* Content for active hosts tab */}
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
                                } ${
                                  column.key === "properties"
                                    ? "hidden md:table-cell"
                                    : ""
                                } ${
                                  column.key === "location"
                                    ? "hidden lg:table-cell"
                                    : ""
                                } ${
                                  column.key === "joinDate"
                                    ? "hidden lg:table-cell"
                                    : ""
                                } ${
                                  column.key === "rating"
                                    ? "hidden xl:table-cell"
                                    : ""
                                }`}
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
                          {paginatedHosts.filter(
                            (host) => host.status === "active"
                          ).length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={visibleColumns.length + 1}
                                className="text-center py-10 text-slate-500"
                              >
                                {emptyState || "No active hosts found."}
                              </TableCell>
                            </TableRow>
                          ) : (
                            paginatedHosts
                              .filter((host) => host.status === "active")
                              .map((host) => (
                                <TableRow
                                  key={host.id}
                                  className="hover:bg-slate-50/50 border-slate-200"
                                >
                                  {visibleColumns.map((column) => (
                                    <TableCell
                                      key={`${host.id}-${column.key}`}
                                      className={`
                                        ${
                                          column.key === "properties"
                                            ? "hidden md:table-cell"
                                            : ""
                                        }
                                        ${
                                          column.key === "location"
                                            ? "hidden lg:table-cell"
                                            : ""
                                        }
                                        ${
                                          column.key === "joinDate"
                                            ? "hidden lg:table-cell text-slate-600"
                                            : ""
                                        }
                                        ${
                                          column.key === "rating"
                                            ? "hidden xl:table-cell"
                                            : ""
                                        }
                                      `}
                                    >
                                      {column.render
                                        ? column.render(host)
                                        : host[column.key]}
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
                                          onClick={() => openViewDialog(host)}
                                          className="cursor-pointer"
                                        >
                                          <Eye className="mr-2 h-4 w-4 text-slate-500" />
                                          View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => openEditDialog(host)}
                                          className="cursor-pointer"
                                        >
                                          <Edit className="mr-2 h-4 w-4 text-slate-500" />
                                          Edit Host
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onClick={() => openDeleteDialog(host)}
                                          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                        >
                                          <Trash className="mr-2 h-4 w-4" />
                                          Delete Host
                                        </DropdownMenuItem>
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
                {/* Content for pending hosts tab */}
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
                                } ${
                                  column.key === "properties"
                                    ? "hidden md:table-cell"
                                    : ""
                                } ${
                                  column.key === "location"
                                    ? "hidden lg:table-cell"
                                    : ""
                                } ${
                                  column.key === "joinDate"
                                    ? "hidden lg:table-cell"
                                    : ""
                                } ${
                                  column.key === "rating"
                                    ? "hidden xl:table-cell"
                                    : ""
                                }`}
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
                          {paginatedHosts.filter(
                            (host) => host.status === "pending"
                          ).length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={visibleColumns.length + 1}
                                className="text-center py-10 text-slate-500"
                              >
                                {emptyState || "No pending hosts found."}
                              </TableCell>
                            </TableRow>
                          ) : (
                            paginatedHosts
                              .filter((host) => host.status === "pending")
                              .map((host) => (
                                <TableRow
                                  key={host.id}
                                  className="hover:bg-slate-50/50 border-slate-200"
                                >
                                  {visibleColumns.map((column) => (
                                    <TableCell
                                      key={`${host.id}-${column.key}`}
                                      className={`
                                        ${
                                          column.key === "properties"
                                            ? "hidden md:table-cell"
                                            : ""
                                        }
                                        ${
                                          column.key === "location"
                                            ? "hidden lg:table-cell"
                                            : ""
                                        }
                                        ${
                                          column.key === "joinDate"
                                            ? "hidden lg:table-cell text-slate-600"
                                            : ""
                                        }
                                        ${
                                          column.key === "rating"
                                            ? "hidden xl:table-cell"
                                            : ""
                                        }
                                      `}
                                    >
                                      {column.render
                                        ? column.render(host)
                                        : host[column.key]}
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
                                          onClick={() => openViewDialog(host)}
                                          className="cursor-pointer"
                                        >
                                          <Eye className="mr-2 h-4 w-4 text-slate-500" />
                                          View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => openEditDialog(host)}
                                          className="cursor-pointer"
                                        >
                                          <Edit className="mr-2 h-4 w-4 text-slate-500" />
                                          Edit Host
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onClick={() => openDeleteDialog(host)}
                                          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                        >
                                          <Trash className="mr-2 h-4 w-4" />
                                          Delete Host
                                        </DropdownMenuItem>
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
                {/* Content for inactive hosts tab */}
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
                                } ${
                                  column.key === "properties"
                                    ? "hidden md:table-cell"
                                    : ""
                                } ${
                                  column.key === "location"
                                    ? "hidden lg:table-cell"
                                    : ""
                                } ${
                                  column.key === "joinDate"
                                    ? "hidden lg:table-cell"
                                    : ""
                                } ${
                                  column.key === "rating"
                                    ? "hidden xl:table-cell"
                                    : ""
                                }`}
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
                          {paginatedHosts.filter(
                            (host) => host.status === "inactive"
                          ).length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={visibleColumns.length + 1}
                                className="text-center py-10 text-slate-500"
                              >
                                {emptyState || "No inactive hosts found."}
                              </TableCell>
                            </TableRow>
                          ) : (
                            paginatedHosts
                              .filter((host) => host.status === "inactive")
                              .map((host) => (
                                <TableRow
                                  key={host.id}
                                  className="hover:bg-slate-50/50 border-slate-200"
                                >
                                  {visibleColumns.map((column) => (
                                    <TableCell
                                      key={`${host.id}-${column.key}`}
                                      className={`
                                        ${
                                          column.key === "properties"
                                            ? "hidden md:table-cell"
                                            : ""
                                        }
                                        ${
                                          column.key === "location"
                                            ? "hidden lg:table-cell"
                                            : ""
                                        }
                                        ${
                                          column.key === "joinDate"
                                            ? "hidden lg:table-cell text-slate-600"
                                            : ""
                                        }
                                        ${
                                          column.key === "rating"
                                            ? "hidden xl:table-cell"
                                            : ""
                                        }
                                      `}
                                    >
                                      {column.render
                                        ? column.render(host)
                                        : host[column.key]}
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
                                          onClick={() => openViewDialog(host)}
                                          className="cursor-pointer"
                                        >
                                          <Eye className="mr-2 h-4 w-4 text-slate-500" />
                                          View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => openEditDialog(host)}
                                          className="cursor-pointer"
                                        >
                                          <Edit className="mr-2 h-4 w-4 text-slate-500" />
                                          Edit Host
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onClick={() => openDeleteDialog(host)}
                                          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                        >
                                          <Trash className="mr-2 h-4 w-4" />
                                          Delete Host
                                        </DropdownMenuItem>
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

      {/* Add Host Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Host</DialogTitle>
            <DialogDescription>
              Create a new host account for your platform
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddHost}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-slate-700">
                  Host Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter host business name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="border-slate-300"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-slate-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="border-slate-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="country" className="text-slate-700">
                    Country
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="Enter country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="border-slate-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city" className="text-slate-700">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="locations" className="text-slate-700">
                    Number of Locations
                  </Label>
                  <Input
                    id="locations"
                    name="locations"
                    type="number"
                    min="1"
                    value={formData.locations}
                    onChange={handleInputChange}
                    required
                    className="border-slate-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status" className="text-slate-700">
                    Initial Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions
                        .filter((option) => option.value !== "all")
                        .map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contactPerson" className="text-slate-700">
                  Contact Person
                </Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  placeholder="Enter contact person name"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className="border-slate-300"
                />
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
                {addMutation.isPending ? "Adding..." : "Add Host"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Host Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Host</DialogTitle>
            <DialogDescription>Update host information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateHost}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name" className="text-slate-700">
                  Host Name
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="Enter host name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="border-slate-300"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email" className="text-slate-700">
                  Email Address
                </Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="border-slate-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-country" className="text-slate-700">
                    Country
                  </Label>
                  <Input
                    id="edit-country"
                    name="country"
                    placeholder="Enter country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="border-slate-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-city" className="text-slate-700">
                    City
                  </Label>
                  <Input
                    id="edit-city"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-locations" className="text-slate-700">
                    Number of Locations
                  </Label>
                  <Input
                    id="edit-locations"
                    name="locations"
                    type="number"
                    min="1"
                    value={formData.locations}
                    onChange={handleInputChange}
                    required
                    className="border-slate-300"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status" className="text-slate-700">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions
                        .filter((option) => option.value !== "all")
                        .map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-contactPerson" className="text-slate-700">
                  Contact Person
                </Label>
                <Input
                  id="edit-contactPerson"
                  name="contactPerson"
                  placeholder="Enter contact person name"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className="border-slate-300"
                />
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
        </DialogContent>
      </Dialog>

      {/* View Host Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Host Details</DialogTitle>
          </DialogHeader>
          {currentHost && (
            <ScrollArea className="max-h-[60vh]">
              <div className="p-2">
                <div className="flex flex-col items-center pb-4 mb-4 border-b border-slate-200">
                  <Avatar className="h-20 w-20 mb-3">
                    <AvatarImage
                      src={currentHost.avatar}
                      alt={currentHost.name}
                    />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl">
                      {currentHost.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold text-slate-800">
                    {currentHost.name}
                  </h3>
                  <p className="text-slate-500">{currentHost.email}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    {renderStatusBadge(currentHost.status)}
                    <span className="text-sm text-slate-500">
                      {currentHost.status === "active"
                        ? "Active since"
                        : currentHost.status === "pending"
                        ? "Pending since"
                        : "Inactive since"}{" "}
                      {currentHost.joinDate}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col p-3 bg-slate-50 rounded-md">
                      <span className="text-xs text-slate-500 mb-1">
                        Properties
                      </span>
                      <span className="text-lg font-semibold text-slate-900">
                        {currentHost.properties}
                      </span>
                    </div>
                    <div className="flex flex-col p-3 bg-slate-50 rounded-md">
                      <span className="text-xs text-slate-500 mb-1">
                        Locations
                      </span>
                      <span className="text-lg font-semibold text-slate-900">
                        {currentHost.locations}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">
                      Rating
                    </h4>
                    {renderRatingStars(currentHost.rating)}
                  </div>

                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">
                      Location
                    </h4>
                    <div className="flex items-center text-slate-600">
                      <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                      <span>
                        {currentHost.city}, {currentHost.country}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">
                      Contact Person
                    </h4>
                    <div className="flex items-center text-slate-600">
                      <User className="h-4 w-4 mr-2 text-slate-400" />
                      <span>{currentHost.contactPerson}</span>
                    </div>
                  </div>

                  {currentHost.propertyTypes && (
                    <div className="pt-2">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">
                        Property Types
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentHost.propertyTypes.map((type, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-indigo-50 border-indigo-200 text-indigo-700"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentHost.revenue && (
                    <div className="pt-2">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">
                        Revenue
                      </h4>
                      <div className="flex items-center text-slate-600">
                        <span className="text-lg font-medium text-emerald-600">
                          {currentHost.revenue}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => currentHost && openEditDialog(currentHost)}
            >
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
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
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600">
              Delete Host
            </DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="flex items-center p-4 mb-4 bg-red-50 text-red-800 rounded-md">
              <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">
                  Are you sure you want to delete this host?
                </p>
                <p className="mt-1 text-sm text-red-700">
                  Deleting{" "}
                  <span className="font-semibold">{currentHost?.name}</span>{" "}
                  will remove all their data from your platform.
                </p>
              </div>
            </div>
            {currentHost?.properties && (
              <p className="text-sm text-slate-600">
                Note: This will affect {currentHost.properties} properties and
                might impact ongoing bookings.
              </p>
            )}
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
              onClick={handleDeleteHost}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Host"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HostManagement;
