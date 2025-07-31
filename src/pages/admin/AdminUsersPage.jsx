import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search, Plus, Edit, Trash2, Shield, User, Users, MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const { toast } = useToast();

  const API = axios.create({
    baseURL: `${BASE_URL}/api/users`,
    withCredentials: true, // for auth cookies/tokens if needed
  });

  const fetchUsers = async () => {
    try {
      const res = await API.get('/');
      setUsers(res.data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch users' });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase())
      || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/${userId}/role`, { role: newRole });
      setUsers(prev =>
        prev.map(user =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      toast({ title: 'Role Updated', description: `Role changed to ${newRole}` });
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update role' });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await API.delete(`/${userId}`);
      setUsers(prev => prev.filter(user => user._id !== userId));
      toast({ title: 'User Deleted', description: 'User deleted successfully' });
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete user' });
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'problem-setter': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'student': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const roleStats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    problemSetters: users.filter(u => u.role === 'problem-setter').length,
    students: users.filter(u => u.role === 'student').length,
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6 px-4 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
              <p className="text-muted-foreground">Manage user accounts, roles, and permissions across the platform</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card><CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center text-muted-foreground">
                <Users className="h-4 w-4 mr-2" /> Total Users
              </CardTitle>
              <div className="text-2xl font-bold">{roleStats.total}</div>
              <p className="text-xs text-emerald-400">+12 this month</p>
            </CardHeader></Card>
            <Card><CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center text-muted-foreground">
                <Shield className="h-4 w-4 mr-2" /> Admins
              </CardTitle>
              <div className="text-2xl font-bold text-red-400">{roleStats.admins}</div>
              <p className="text-xs text-muted-foreground">System access</p>
            </CardHeader></Card>
            <Card><CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center text-muted-foreground">
                <Edit className="h-4 w-4 mr-2" /> Problem Setters
              </CardTitle>
              <div className="text-2xl font-bold text-blue-400">{roleStats.problemSetters}</div>
              <p className="text-xs text-muted-foreground">Content creators</p>
            </CardHeader></Card>
            <Card><CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center text-muted-foreground">
                <User className="h-4 w-4 mr-2" /> Students
              </CardTitle>
              <div className="text-2xl font-bold text-green-400">{roleStats.students}</div>
              <p className="text-xs text-muted-foreground">Active learners</p>
            </CardHeader></Card>
          </div>

          {/* Filters */}
          <Card className="mb-6"><CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10" placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="problem-setter">Problem Setter</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent></Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Complete list of registered users</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{user.username}</div>
                            {/* <div className="text-sm text-muted-foreground">{user.email}</div> */}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground"> {user.createdAt ? user.createdAt.slice(0, 10) : '-'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleRoleChange(user._id, 'admin')}>
                              <Shield className="mr-2 h-4 w-4 text-red-400" /> Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user._id, 'problem-setter')}>
                              <Edit className="mr-2 h-4 w-4 text-blue-400" /> Make Problem Setter
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user._id, 'student')}>
                              <User className="mr-2 h-4 w-4 text-green-400" /> Make Student
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteUser(user._id)} className="text-red-500">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsersPage;
