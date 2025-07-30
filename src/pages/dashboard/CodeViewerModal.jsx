import React from 'react';
import { X, Clock, CheckCircle, XCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Submission Info Component
const SubmissionInfo = ({ submission }) => (
  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
    <div className="flex items-center space-x-2">
      <Badge variant="outline" className="bg-muted">
        {submission.language}
      </Badge>
    </div>
    {/* <div>Runtime: <span className="text-foreground">{submission.runtime}</span></div> */}
    {/* <div>Memory: <span className="text-foreground">{submission.memory}</span></div> */}
    <div>Submitted: <span className="text-foreground">{submission.submittedAt}</span></div>
  </div>
);

// Code Display Component
const CodeDisplay = ({ code }) => (
  <div className="leetcode-card">
    <div className="bg-muted px-3 py-2 border-b border-border">
      <span className="text-sm font-medium text-foreground">Code</span>
    </div>
    <div className="p-4">
      <pre className="text-sm font-mono text-foreground whitespace-pre-wrap overflow-auto max-h-96">
        {code}
      </pre>
    </div>
  </div>
);

// Status Header Component
const StatusHeader = ({ submission, copyCode, getStatusIcon, getStatusColor }) => (
  <DialogTitle className="text-foreground flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <span>{submission.problem}</span>
      <div className="flex items-center space-x-2">
        {getStatusIcon(submission.status)}
        <span className={`text-sm ${getStatusColor(submission.status)}`}>
          {submission.status}
        </span>
      </div>
    </div>
    <Button
      variant="ghost"
      size="sm"
      onClick={copyCode}
      className="text-muted-foreground hover:text-foreground"
    >
      <Copy className="h-4 w-4" />
    </Button>
  </DialogTitle>
);

const CodeViewerModal = ({ submission, isOpen, onClose }) => {
  const { toast } = useToast();

  const getStatusIcon = (status) => {
    if (status === 'Accepted') return <CheckCircle className="h-4 w-4 status-accepted" />;
    if (status === 'Time Limit Exceeded') return <Clock className="h-4 w-4 status-timeout" />;
    return <XCircle className="h-4 w-4 status-wrong" />;
  };

  const getStatusColor = (status) => {
    if (status === 'Accepted') return 'status-accepted';
    if (status === 'Time Limit Exceeded') return 'status-timeout';
    return 'status-wrong';
  };

  const copyCode = async () => {
    if (submission?.code) {
      await navigator.clipboard.writeText(submission.code);
      toast({
        title: "Code Copied",
        description: "Code copied to clipboard!",
      });
    }
  };

  if (!submission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-background border-border">
        <DialogHeader>
          <StatusHeader
            submission={submission}
            copyCode={copyCode}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
          />
        </DialogHeader>
        
        <div className="space-y-4">
          <SubmissionInfo submission={submission} />
          <CodeDisplay code={submission.code} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodeViewerModal;