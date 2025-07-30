// src/pages/problems/MyProblemsPage.jsx
import React, { useState } from 'react'
import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card, CardContent } from '../../../components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../../../components/ui/table'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../../../components/ui/select'
import { Badge } from '../../../components/ui/badge'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../../../components/ui/alert-dialog'
import Layout from '../../../components/layout/Layout'
import { ROUTES } from '../../../utils/constant'
import { useToast } from '../../../hooks/use-toast'

export default function MyProblemsPage() {
  const [searchTerm, setSearchTerm]     = useState('')
  const [difficulty, setDifficulty]     = useState('all')
  const [tagFilter, setTagFilter]       = useState('all')
  const [sortOrder, setSortOrder]       = useState('newest')
  const [page, setPage]                 = useState(1)
  const [toDeleteId, setToDeleteId]     = useState(null)
  const pageSize = 10

  const { toast } = useToast()
  const navigate  = useNavigate()
  const qc        = useQueryClient()
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // fetch tags
  const { data: allTags = [] } = useQuery({
    queryKey: ['myProblems','tags'],
    queryFn: () =>
      axios.get(`${BASE_URL}/api/problems/tags`, { withCredentials: true })
           .then(r => r.data),
    staleTime: 60_000,
  })

  // fetch my problems
  const { data, isLoading } = useQuery({
    queryKey: ['myProblems', page, searchTerm, difficulty, tagFilter, sortOrder],
    queryFn: () =>
      axios.get(`${BASE_URL}/api/problems/mine`, {
        params: {
          page,
          limit: pageSize,
          search: searchTerm || undefined,
          difficulty: difficulty !== 'all' ? difficulty : undefined,
          tag: tagFilter !== 'all' ? tagFilter : undefined,
          sort: sortOrder,
        },
        withCredentials: true,
      }).then(r => r.data),
    keepPreviousData: true,
  })

  // delete mutation
  const deleteMutation = useMutation({
    mutationFn: id =>
      axios.delete(`http://localhost:3000/api/problems/${id}`, { withCredentials: true }),
    onSuccess: () => {
      qc.invalidateQueries(['myProblems'])
      toast({ title: 'Deleted', description: 'Problem removed.' })
      setToDeleteId(null)
    },
  })

  if (isLoading) {
    return (
      <Layout>
       <div className="min-h-screen flex items-center justify-center">
          <span className="text-gray-400">Loading…</span>
        </div>
      </Layout>
    )
  }

  const { total = 0, data: problems = [] } = data
  const totalPages = Math.ceil(total / pageSize)
  const startItem  = (page - 1) * pageSize + 1
  const endItem    = Math.min(page * pageSize, total)

  const getDifficultyColor = d =>
    d === 'easy'   ? 'text-green-400'
  : d === 'medium' ? 'text-yellow-400'
  : d === 'hard'   ? 'text-red-400'
                   : 'text-gray-400'

  return (
    <Layout>
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-6 max-w-6xl">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold">My Problems</h1>
              <p className="text-gray-300">Manage problems you’ve authored</p>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate(ROUTES.CREATE_PROBLEM)}
            >
              <Plus className="mr-2 h-5 w-5" /> New Problem
            </Button>
          </div>

          {/* Search & Filters */}
          <Card className="bg-slate-800 mb-6">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search by title…"
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setPage(1) }}
                  className="pl-10 bg-slate-700"
                />
              </div>

              {/* Difficulty */}
              <Select
                value={difficulty}
                onValueChange={val => { setDifficulty(val); setPage(1) }}
              >
                <SelectTrigger className="w-40 bg-slate-700">
                  <SelectValue>
                    {difficulty === 'all'
                      ? 'All Difficulties'
                      : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-slate-800">
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              {/* Tag */}
              <Select
                value={tagFilter}
                onValueChange={val => { setTagFilter(val); setPage(1) }}
              >
                <SelectTrigger className="w-40 bg-slate-700">
                  <SelectValue>
                    {tagFilter === 'all' ? 'All Tags' : tagFilter}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-slate-800 max-h-60 overflow-auto">
                  <SelectItem value="all">All Tags</SelectItem>
                  {allTags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select
                value={sortOrder}
                onValueChange={val => { setSortOrder(val); setPage(1) }}
              >
                <SelectTrigger className="w-40 bg-slate-700">
                  <SelectValue>
                    {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-slate-800">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Problems Table */}
          <Card className="bg-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-700">
                  <TableHead className="text-gray-300">Title</TableHead>
                  <TableHead className="text-gray-300">Difficulty</TableHead>
                  <TableHead className="text-gray-300">Tags</TableHead>
                  <TableHead className="text-gray-300">Created</TableHead>
                  <TableHead className="text-gray-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {problems.map(p => (
                  <TableRow key={p._id} className="even:bg-slate-900 hover:bg-slate-700/30 transition">
                    <TableCell>
                      <Link to={`${ROUTES.PROBLEM_DETAIL(p._id)}`} className="text-purple-400 hover:underline">
                        {p.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className={getDifficultyColor(p.difficulty)}>
                        {p.difficulty.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {p.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="bg-slate-700 text-gray-200">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`${ROUTES.CREATE_PROBLEM}?id=${p._id}`)}
                      >
                        <Edit className="h-4 w-4 text-blue-400" />
                      </Button>

                      {/* Delete with confirmation */}
                      <AlertDialog
                        open={toDeleteId === p._id}
                        onOpenChange={open => !open && setToDeleteId(null)}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setToDeleteId(p._id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-800 border border-gray-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              Confirm Deletion
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                              Are you sure you want to delete “{p.title}”? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="hover:bg-gray-700">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => deleteMutation.mutate(p._id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 text-gray-400">
            <span>
              Showing {startItem}–{endItem} of {total} problems
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(o => Math.max(1, o - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={i + 1 === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(o => Math.min(totalPages, o + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
