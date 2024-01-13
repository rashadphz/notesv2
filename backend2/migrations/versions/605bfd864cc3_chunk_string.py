"""chunk string

Revision ID: 605bfd864cc3
Revises: 4e6288182e4c
Create Date: 2023-08-05 20:48:01.915060

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '605bfd864cc3'
down_revision = '4e6288182e4c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('chunks', sa.Column('text', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('chunks', 'text')
    # ### end Alembic commands ###