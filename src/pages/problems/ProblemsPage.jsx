// src/pages/problems/ProblemsPage.jsx
// src/pages/problems/ProblemsPage.jsx
import React, { useState } from 'react'
import { Search, CheckCircle, Clock, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card } from '../../components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '../../components/ui/table'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import Layout from '../../components/layout/Layout'
import { useToast } from '../../hooks/use-toast'


export default function ProblemsPage() {
  const [searchTerm, setSearchTerm]       = useState('')
  const [difficultyFilter, setDifficulty] = useState('all')
  const [tagFilter, setTagFilter]         = useState('all')
  const [sortOrder, setSortOrder]         = useState('newest')
  const [page, setPage]                   = useState(1)
  const pageSize = 10
  const { toast } = useToast()
  // fetch available tags
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { data: allTags = [] } = useQuery({
    queryKey: ['allTags'],
    queryFn: () =>
      axios
        .get(`${BASE_URL}/api/problems/tag`, { withCredentials: true })
        .then(res => res.data),
    staleTime: 60_000,
  })

  // fetch paged, filtered, sorted problems
  const { data, isLoading } = useQuery({
    queryKey: [
      'problems',
      page,
      searchTerm,
      difficultyFilter,
      tagFilter,
      sortOrder
    ],
    queryFn: () =>
      axios
        .get(`${BASE_URL}/api/problems`, {
          params: {
            page,
            limit: pageSize,
            search: searchTerm || undefined,
            difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
            tag: tagFilter !== 'all' ? tagFilter : undefined,
            sort: sortOrder
          },
          withCredentials: true
        })
        .then(res => res.data),
    keepPreviousData: true
  })

  const total      = data?.total  || 0
  const problems   = data?.data   || []
  const totalPages = Math.ceil(total / pageSize)
  const startItem  = (page - 1) * pageSize + 1
  const endItem    = Math.min(page * pageSize, total)

  function getDifficultyColor(diff) {
    return diff === 'easy'
      ? 'text-green-400'
      : diff === 'medium'
      ? 'text-yellow-400'
      : diff === 'hard'
      ? 'text-red-400'
      : 'text-gray-300'
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <span className="text-gray-400">Loading…</span>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-6 max-w-6xl">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Problems</h1>
            <p className="text-gray-400">Solve algorithm & data structure problems</p>
          </div>

          {/* Search + Filters */}
          <Card className="bg-slate-800 mb-6 p-4">
            <p className="text-gray-300 mb-2">Search by title, difficulty, or tag</p>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search questions…"
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setPage(1) }}
                  className="pl-10 bg-slate-700"
                />
              </div>

              {/* Difficulty */}
              <Select
                value={difficultyFilter}
                onValueChange={val => { setDifficulty(val); setPage(1) }}
              >
                <SelectTrigger className="w-40 bg-slate-700">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800">
                  <SelectItem value="all">All</SelectItem>
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
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 max-h-60 overflow-auto">
                  <SelectItem value="all">All</SelectItem>
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
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Problems Table */}
          <Card className="bg-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-700">
                  <TableHead>Status</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Acceptance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {problems.map((p, i) => (
                  <TableRow key={p._id} className="even:bg-slate-900">
                    <TableCell>
                    {p.status === 'Accepted' ? (
                      <CheckCircle className="text-green-400" />
                    ) : p.status === 'Rejected' ? (
                      <XCircle className="text-red-400" />
                    ) : (
                      <span className="text-gray-500">–</span> // Not logged in
                    )}
                  </TableCell>
            
                    <TableCell>
                      <Link
                        to={`/problems/${p._id}`}
                        className="text-purple-400 hover:underline"
                      >
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
                        {p.tags.slice(0, 2).map(t => (
                          <Badge key={t} variant="outline">{t}</Badge>
                        ))}
                        {p.tags.length > 2 && (
                          <Badge variant="outline">+{p.tags.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{p.acceptanceRate}%</TableCell>
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
                onClick={() => setPage(old => Math.max(1, old - 1))}
                disabled={page === 1}
              >
                <ChevronLeft />
              </Button>
              {[...Array(totalPages)].map((_, idx) => (
                <Button
                  key={idx}
                  variant={idx + 1 === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(idx + 1)}
                >
                  {idx + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(old => Math.min(totalPages, old + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}
