import { useVotes } from "@/hooks/use-votes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Analytics() {
  const { posters, loading } = useVotes();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Loading analytics...</h1>
      </div>
    );
  }

  const votesData = posters.map(poster => ({
    name: poster.teamName,
    upvotes: poster.upvotes,
    downvotes: poster.downvotes,
    total: poster.upvotes + poster.downvotes,
    ratio: poster.upvotes / (poster.upvotes + poster.downvotes) || 0
  }));

  const totalVotesData = votesData.map(data => ({
    name: data.name,
    votes: data.total
  }));

  const aggregateData = [
    { name: 'Upvotes', value: posters.reduce((sum, poster) => sum + poster.upvotes, 0) },
    { name: 'Downvotes', value: posters.reduce((sum, poster) => sum + poster.downvotes, 0) }
  ];

  const COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Vote Analytics
        </h1>
      </div>

      {/* Raw Data Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Poster Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Team Name</th>
                  <th className="text-center p-2">Upvotes</th>
                  <th className="text-center p-2">Downvotes</th>
                  <th className="text-center p-2">Total Votes</th>
                  <th className="text-center p-2">Created At</th>
                </tr>
              </thead>
              <tbody>
                {posters.map((poster) => (
                  <tr key={poster.id} className="border-b">
                    <td className="p-2">{poster.teamName}</td>
                    <td className="text-center p-2">{poster.upvotes}</td>
                    <td className="text-center p-2">{poster.downvotes}</td>
                    <td className="text-center p-2">{poster.upvotes + poster.downvotes}</td>
                    <td className="text-center p-2">
                      {new Date(poster.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Votes by Poster</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={totalVotesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votes" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vote Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={aggregateData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {aggregateData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upvotes vs Downvotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={votesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="upvotes" fill="#10B981" name="Upvotes" />
                  <Bar dataKey="downvotes" fill="#EF4444" name="Downvotes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}